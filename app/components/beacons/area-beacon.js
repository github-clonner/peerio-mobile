import PropTypes from 'prop-types';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Dimensions, TouchableOpacity, LayoutAnimation, Image } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';
import { User } from '../../lib/icebear';
import beaconState from './beacon-state';
import { tx } from '../utils/translator';

const pointerSource = require('../../assets/pointer-beacon.png');

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const textStyle = {
    lineHeight: vars.beaconLineHeight,
    fontSize: vars.font.size.smaller,
    color: 'white'
};

@observer
export default class AreaBeacon extends SafeComponent {
    @observable descriptionTextHeight;

    componentWillMount() {
        LayoutAnimation.easeInEaseOut();
    }

    @action.bound onPress() {
        const { id } = this.props;
        beaconState.removeBeacon(id);

        User.current.beacons.set(id, true);
        // we are not waiting for saveBeacons because there's no visual feedback
        User.current.saveBeacons();
    }

    get beaconHeight() {
        const { headerText, descriptionText } = this.props;

        return (
            // Header height + its padding
            (headerText ? vars.beaconLineHeight + vars.beaconPadding : 0) +
            // Description text height (taken from onLayout); is equivalent to lineHeight * numberOfLines
            (descriptionText ? this.descriptionTextHeight : 0) +
            // Container padding
            (2 * vars.beaconPadding));
    }

    get beaconIsTop() {
        if (!this.props.position) return null;
        const { pageY: y } = this.props.position;
        return y <= windowHeight / 2;
    }

    get contentPositionHorizontal() {
        return this.props.position.pageX;
    }

    get pointerHorizontalLeftMost() {
        return {
            containerWidth: vars.beaconWidth,
            containerPositionX: { left: this.contentPositionHorizontal - vars.pointerHeight },
            pointerPositionX: { left: vars.pointerPadding },
            pointerPositionY: this.beaconIsTop ? { top: 0 } : { bottom: 0 },
            rectanglePositionX: { left: 0 }
        };
    }

    get pointerHorizontalOneThird() {
        return {
            containerWidth: vars.beaconWidth,
            containerPositionX: { left: this.contentPositionHorizontal - vars.beaconWidth / 3 },
            pointerPositionX: { left: vars.beaconWidth / 3 },
            rectanglePositionX: { left: 0 }
        };
    }

    get pointerHorizontalTwoThirds() {
        return {
            containerWidth: vars.beaconWidth,
            containerPositionX: { right: this.contentPositionHorizontal - 2 * vars.beaconWidth / 3 },
            pointerPositionX: { right: vars.beaconWidth / 3 },
            rectanglePositionX: { right: 0 }
        };
    }

    get pointerHorizontalRightMost() {
        return {
            containerWidth: vars.beaconWidth,
            containerPositionX: { right: this.contentPositionHorizontal - vars.beaconWidth - vars.pointerHeight },
            pointerPositionX: { right: vars.pointerPadding },
            rectanglePositionX: { left: 0 }
        };
    }

    // only have 4 positions for now, even though design wants them to be flexible
    // set beacon position X based on where content is with regards to the width of the screen
    get horizontalPointerMeasures() {
        const { position } = this.props;
        if (!position) return null;

        const { pageX: x } = position;

        let measure = 'pointerHorizontalLeftMost';
        if (x >= windowWidth / 4) measure = 'pointerHorizontalOneThird';
        if (x >= windowWidth / 2) measure = 'pointerHorizontalTwoThirds';
        if (x >= windowWidth * 3 / 4) measure = 'pointerHorizontalRightMost';

        return this[measure];
    }

    // only have one position for now which is centered, even though design wants them to be flexible
    get verticalPointerMeasures() {
        return { pointerPositionY: { top: 0, bottom: 0 } };
    }

    get containerPositionY() {
        const { pageY, frameHeight } = this.props.position;
        return this.beaconIsTop ?
            { top: pageY - (vars.pointerHeight - frameHeight) / 2 } : { top: pageY - (this.beaconHeight - frameHeight / 2) - 3 - vars.pointerHeight };
    }

    @action.bound onDescriptionTextLayout(e) {
        const { height } = e.nativeEvent.layout;
        this.descriptionTextHeight = height;
    }

    renderThrow() {
        const { position, headerText, descriptionText, pointerDirection } = this.props;

        if (!position || !headerText && !descriptionText || !pointerDirection) return null;

        let pointerMeasures;
        if (pointerDirection === 'left' || pointerDirection === 'right') pointerMeasures = this.verticalPointerMeasures;
        else if (pointerDirection === 'up' || pointerDirection === 'down') pointerMeasures = this.horizontalPointerMeasures;
        else throw Error('Area Beacon: Invalid pointer direction. Should be one of "right", "left", "up", "down"');

        const {
            containerWidth,
            containerPositionX,
            pointerPositionX,
            pointerPositionY,
            rectanglePositionX
        } = pointerMeasures;

        const container = [containerPositionX, this.containerPositionY, {
            width: containerWidth,
            height: this.beaconHeight + vars.pointerHeight,
            position: 'absolute',
            borderColor: 'red',
            borderWidth: 1
        }];

        const rectanglePositionY = this.beaconIsTop ? { bottom: 0 } : { top: 0 };

        const rectangle = [rectanglePositionY, rectanglePositionX, {
            position: 'absolute',
            width: vars.beaconWidth,
            height: this.beaconHeight,
            backgroundColor: vars.beaconBg,
            borderRadius: 8,
            padding: vars.beaconPadding,
            borderColor: 'green',
            borderWidth: 1
        }];

        const pointer = [pointerPositionY, pointerPositionX, {
            position: 'absolute',
            width: vars.pointerWidth,
            height: vars.pointerHeight,
            transform: [{ rotate: '180deg' }]
        }];

        return (
            <View style={container} pointerEvents="box-none">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.onPress}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    style={rectangle}>
                    {headerText && <Text bold style={[textStyle, { paddingBottom: vars.beaconPadding }]}>{tx(headerText)}</Text>}
                    {descriptionText && <Text semibold={!headerText} style={textStyle} onLayout={this.onDescriptionTextLayout}>{tx(descriptionText)}</Text>}
                </TouchableOpacity>
                <Image style={pointer} source={pointerSource} />
            </View>
        );
    }
}

AreaBeacon.propTypes = {
    id: PropTypes.any,
    position: PropTypes.any,
    headerText: PropTypes.any,
    descriptionText: PropTypes.any
};

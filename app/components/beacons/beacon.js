import PropTypes from 'prop-types';
import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Dimensions, TouchableOpacity, LayoutAnimation } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';
import { User } from '../../lib/icebear';
import beaconState from './beacon-state';
import { tx } from '../utils/translator';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const MINIMUM_BUBBLE_RADIUS = 32;

const textStyle = {
    fontSize: vars.font.size.smaller,
    color: 'white'
};

@observer
export default class Beacon extends SafeComponent {
    componentWillMount() {
        LayoutAnimation.easeInEaseOut();
    }

    markSeen = (id) => {
        User.current.beacons.set(id, true);
        // we are not waiting for saveBeacons because there's no visual feedback
        User.current.saveBeacons();
    };

    @action.bound onPress() {
        const { id } = this.props;
        beaconState.removeBeacon(id);
        this.markSeen(id);
    }

    @action.bound onPressContainer() {
        const { flow } = this.props;
        this.onPress();
        if (flow) {
            beaconState.beacons
                .filter(b => b.flow === flow)
                .forEach(b => this.markSeen(b.id));
        }
    }

    @action.bound onPressIcon() {
        this.onPress();
        this.props.onPressIcon();
    }

    // height of the beacon which depends on the text content
    get beaconHeight() {
        const { textHeader, textDescription } = this.props;

        return (textHeader ? vars.beaconLineHeight : 0) +
            (textDescription ? vars.beaconLineHeight : 0) +
            (2 * vars.beaconPadding) +
            (this.bubbleDiameter / 2);
    }

    get beaconIsTop() {
        if (!this.props.position) return null;
        const { pageY: y } = this.props.position;
        return y <= windowHeight / 2;
    }

    get bubbleDiameter() {
        const outerRadius = this.props.position.frameWidth + 8 + (2 * vars.beaconBorderWidth);
        return outerRadius >= MINIMUM_BUBBLE_RADIUS ? outerRadius : MINIMUM_BUBBLE_RADIUS;
    }

    get bubblePadding() {
        return vars.beaconPadding + this.bubbleDiameter / 2;
    }

    get contentPositionLeft() {
        return this.props.position.pageX - 2 * vars.beaconBorderWidth;
    }

    get horizontalMeasuresLeftMost() {
        return {
            containerWidth: vars.beaconWidth + (this.bubbleDiameter / 2),
            containerPositionX: { left: this.contentPositionLeft },
            circlePositionX: { left: 0 },
            rectanglePositionX: { left: this.bubbleDiameter / 2 },
            rectanglePaddingLeft: this.bubblePadding,
            rectanglePaddingRight: vars.beaconPadding
        };
    }

    get horizontalMeasuresOneThird() {
        return {
            containerWidth: vars.beaconWidth,
            containerPositionX: { left: this.contentPositionLeft - vars.beaconWidth / 3 },
            circlePositionX: { left: vars.beaconWidth / 3 },
            rectanglePositionX: { left: 0 },
            rectanglePaddingLeft: vars.beaconPadding,
            rectanglePaddingRight: vars.beaconPadding
        };
    }

    get horizontalMeasuresTwoThirds() {
        return {
            containerWidth: vars.beaconWidth,
            containerPositionX: { right: windowWidth - this.contentPositionLeft - vars.beaconWidth / 3 },
            circlePositionX: { right: vars.beaconWidth / 3 - this.bubbleDiameter },
            rectanglePositionX: { right: 0 },
            rectanglePaddingLeft: vars.beaconPadding,
            rectanglePaddingRight: vars.beaconPadding
        };
    }

    get horizontalMeasuresRightMost() {
        return {
            containerWidth: vars.beaconWidth + (this.bubbleDiameter / 2),
            containerPositionX: { right: windowWidth - this.contentPositionLeft - this.bubbleDiameter },
            circlePositionX: { right: 0 },
            rectanglePositionX: { left: 0 },
            rectanglePaddingLeft: vars.beaconPadding,
            rectanglePaddingRight: this.bubblePadding
        };
    }

    // set beacon position X based on where content is with regards to the width of the screen
    get horizontalMeasures() {
        const { position } = this.props;
        if (!position) return null;

        const { pageX: x } = position;

        let measure = 'horizontalMeasuresLeftMost';
        if (x >= windowWidth / 4) measure = 'horizontalMeasuresOneThird';
        if (x >= windowWidth / 2) measure = 'horizontalMeasuresTwoThirds';
        if (x >= windowWidth * 3 / 4) measure = 'horizontalMeasuresRightMost';

        return this[measure];
    }

    get verticalLowerHalf() {
        const { pageY, frameHeight } = this.props.position;
        return {
            containerPositionY: { top: pageY - (this.beaconHeight - frameHeight / 2) }
        };
    }

    get verticalUpperHalf() {
        const { pageY } = this.props.position;
        return {
            containerPositionY: { top: pageY - (this.bubbleDiameter / 4) }
        };
    }

    get verticalMeasures() {
        if (this.beaconIsTop) return this.verticalUpperHalf;
        return this.verticalLowerHalf;
    }

    renderThrow() {
        const { position, textHeader, textDescription } = this.props;

        if (!position || !textHeader || !textDescription) return null;

        const {
            containerWidth,
            containerPositionX,
            circlePositionX,
            rectanglePositionX,
            rectanglePaddingLeft,
            rectanglePaddingRight
        } = this.horizontalMeasures;

        const {
            containerPositionY
        } = this.verticalMeasures;

        // set padding between bubble and text based on where the bubble is positioned
        const paddingTop = vars.beaconPadding;
        const paddingBottom = this.beaconIsTop ? this.bubblePadding : vars.beaconPadding;

        const container = [containerPositionX, containerPositionY, {
            width: containerWidth,
            height: this.beaconHeight + (this.bubbleDiameter / 2),
            position: 'absolute'
        }];

        const rectanglePositionY = this.beaconIsTop ? { bottom: 0 } : { top: 0 };

        const rectangle = [rectanglePositionY, rectanglePositionX, {
            position: 'absolute',
            width: vars.beaconWidth,
            height: this.beaconHeight,
            backgroundColor: vars.beaconBg,
            borderRadius: 8,
            paddingLeft: rectanglePaddingLeft,
            paddingRight: rectanglePaddingRight,
            paddingTop,
            paddingBottom
        }];

        const circlePositionY = this.beaconIsTop ? { top: 0 } : { bottom: 0 };
        const outerCircle = [circlePositionY, circlePositionX, {
            position: 'absolute',
            width: this.bubbleDiameter,
            height: this.bubbleDiameter,
            borderRadius: this.bubbleDiameter / 2,
            borderColor: vars.beaconBg,
            borderWidth: vars.beaconBorderWidth,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.props.spotBgColor
        }];

        return (
            <View style={container} pointerEvents="box-none">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.onPressContainer}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    style={rectangle}>
                    {textHeader && <Text bold style={[textStyle, { paddingBottom: vars.beaconPadding }]}>{tx(textHeader)}</Text>}
                    {textDescription && <Text semibold={!textHeader} style={textStyle}>{tx(textDescription)}</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.onPressIcon}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    style={outerCircle}>
                    {this.props.content}
                </TouchableOpacity>
            </View>
        );
    }
}

Beacon.propTypes = {
    textHeader: PropTypes.any,
    textLine1: PropTypes.any,
    textLine2: PropTypes.any,
    textLine3: PropTypes.any
};

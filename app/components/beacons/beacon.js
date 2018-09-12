import PropTypes from 'prop-types';
import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Dimensions, TouchableOpacity } from 'react-native';
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
    bubbleRadius; // outer bubble radius
    bubblePadding; // padding which depends on bubbleRadius
    containerPositionY;
    containerPositionX;
    circlePositionX;

    // height of the beacon which depends on the text content
    get beaconHeight() {
        const { textHeader, textDescription } = this.props;

        return (textHeader ? vars.beaconLineHeight : 0) +
            (textDescription ? vars.beaconLineHeight : 0) +
            (2 * vars.beaconPadding) +
            (this.bubbleRadius / 2);
    }

    get beaconIsTop() {
        if (!this.props.position) return null;
        const { pageY: y } = this.props.position;
        return y <= windowHeight / 2;
    }

    // set beacon position X based on where content is with regards to the width of the screen
    get positionX() {
        const { position } = this.props;
        if (!position) return null;

        const { pageX: x } = position;

        let positionX = 0;
        // positionX can be 0, 1, 2, 3 (left to right)
        if (x >= 0) positionX = 0;
        if (x >= windowWidth / 4) positionX = 1;
        if (x >= windowWidth / 2) positionX = 2;
        if (x >= windowWidth * 3 / 4) positionX = 3;

        return positionX;
    }

    @action.bound
    async onPress() {
        const { id } = this.props;
        beaconState.removeBeacon(id);

        User.current.beacons.set(id, true);
        await User.current.saveBeacons();
    }

    initMeasurements() {
        const { pageX: x, pageY: y, frameWidth: width, frameHeight: height } = this.props.position;

        const outerRadius = width + 8 + (2 * vars.beaconBorderWidth);
        this.bubbleRadius = outerRadius >= MINIMUM_BUBBLE_RADIUS ? outerRadius : MINIMUM_BUBBLE_RADIUS;

        this.bubblePadding = vars.beaconPadding + this.bubbleRadius / 2;

        // containerPositionY
        this.containerPositionY = { top: y - (this.beaconHeight - height / 2) };
        // containerPositionX and circlePositionX
        const contentPositionLeft = x - 2 * vars.beaconBorderWidth;
        const contentPositionRight = x + 2 * vars.beaconBorderWidth;
        if (this.positionX === 0) {
            this.containerPositionX = { left: contentPositionLeft };
            this.circlePositionX = { left: 0 };
        } else if (this.positionX === 1) {
            this.containerPositionX = { left: contentPositionLeft - vars.beaconWidth / 3 };
            this.circlePositionX = { left: vars.beaconWidth / 3 };
        } else if (this.positionX === 2) {
            this.containerPositionX = { right: windowWidth - contentPositionRight - vars.beaconWidth * 2 / 3 };
            this.circlePositionX = { right: vars.beaconWidth / 3 };
        } else if (this.positionX === 3) {
            this.containerPositionX = { right: windowWidth - contentPositionRight - vars.beaconWidth / 3 };
            this.circlePositionX = { right: 0 };
        }
    }

    renderThrow() {
        const { position, textHeader, textDescription } = this.props;

        if (!position || !textHeader || !textDescription) return null;

        this.initMeasurements();
        // set padding between bubble and text based on where the bubble is positioned
        const paddingLeft = this.positionX === 0 ? this.bubblePadding : vars.beaconPadding;
        const paddingRight = this.positionX === 3 ? this.bubblePadding : vars.beaconPadding;
        const paddingTop = vars.beaconPadding;
        const paddingBottom = this.beaconIsTop ? this.bubblePadding : vars.beaconPadding;

        const container = [this.containerPositionX, this.containerPositionY, {
            width: vars.beaconWidth + (this.bubbleRadius / 2),
            height: this.beaconHeight + (this.bubbleRadius / 2)
        }];

        const rectanglePositionY = this.beaconIsTop ? { bottom: 0 } : { top: 0 };
        const rectanglePositionX = this.positionX <= 1 ? { left: this.bubbleRadius / 2 } : { right: this.bubbleRadius / 2 };
        const rectangle = [rectanglePositionY, rectanglePositionX, {
            position: 'absolute',
            width: vars.beaconWidth,
            height: this.beaconHeight,
            backgroundColor: vars.beaconBg,
            borderRadius: 8,
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingBottom
        }];

        const circlePositionY = this.beaconIsTop ? { top: 0 } : { bottom: 0 };
        const outerCircle = [circlePositionY, this.circlePositionX, {
            position: 'absolute',
            width: this.bubbleRadius,
            height: this.bubbleRadius,
            borderRadius: this.bubbleRadius / 2,
            borderColor: vars.beaconBg,
            borderWidth: vars.beaconBorderWidth
        }];

        const innerCircle = {
            backgroundColor: 'white',
            borderRadius: this.bubbleRadius / 2,
            width: this.bubbleRadius - 2 * vars.beaconBorderWidth,
            height: this.bubbleRadius - 2 * vars.beaconBorderWidth
        };
        return (
            <TouchableOpacity
                onPress={this.onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={container}>
                <View style={rectangle}>
                    {textHeader && <Text bold style={[textStyle, { paddingBottom: vars.beaconPadding }]}>{textHeader}</Text>}
                    {textDescription && <Text semibold={!textHeader} style={textStyle}>{textDescription}</Text>}
                </View>
                <View style={outerCircle}>
                    <View style={innerCircle} />{/* TODO Replace with mock content */}
                </View>
            </TouchableOpacity>
        );
    }
}

Beacon.propTypes = {
    textHeader: PropTypes.any,
    textLine1: PropTypes.any,
    textLine2: PropTypes.any,
    textLine3: PropTypes.any
};

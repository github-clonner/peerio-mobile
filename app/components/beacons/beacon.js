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

const textStyle = {
    lineHeight: vars.beaconLineHeight,
    fontSize: vars.font.size.smaller,
    color: 'white'
};

/** "position" relies on passing "position" as props
 *  this.props.position = {
 *      x: contentRef.pageX,
 *      y: contentRef.pageY,
 *      width: contentRef.frameWidth,
 *      height: contentRef.frameHeight,
 */

@observer
export default class Beacon extends SafeComponent {
    bubbleRadius = 32; // TODO determine Radius based on content ?
    beaconPositionX;
    beaconPositionY;

    get beaconHeight() {
        const { textHeader, textDescription } = this.props;

        return (textHeader ? vars.beaconLineHeight : 0) +
            (textDescription ? vars.beaconLineHeight : 0) +
            (2 * vars.beaconPadding) +
            (this.bubbleRadius / 2);
    }

    // set beacon position Y based on where content is with regards to the height of the screen
    get positionY() {
        const { position } = this.props;
        if (!position) return null;
        const { pageY: y } = position;

        return (windowHeight / 2 >= y) ? 0 : -this.beaconHeight;
    }

    // set beacon position X based on where content is with regards to the width of the screen
    get positionX() {
        const { position } = this.props;
        if (!position) return null;

        const { pageX: x } = position;

        let positionX = -1;
        // positionX can be 0, 1, 2, 3 (left to right)
        if (x >= 0) positionX = 0;
        if (x >= windowWidth * 1 / 4) positionX = 1;
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

    renderThrow() {
        const { position, textHeader, textDescription } = this.props;

        if (!position || !textHeader || !textDescription) return null;

        const { pageX: x, pageY: y, frameWidth: width, frameHeight: height } = position;

        // set beacon position Y based on where content is with regards to the height of the screen
        this.beaconPositionY = this.positionY;
        this.beaconPositionX = -vars.beaconWidth * this.positionX / 3;

        // set padding between bubble and text based on where the bubble is positioned
        this.bubblePadding = vars.beaconPadding + this.bubbleRadius / 2;
        const paddingLeft = this.positionX === 0 ? this.bubblePadding : vars.beaconPadding;
        const paddingRight = this.positionX === 3 ? this.bubblePadding : vars.beaconPadding;
        const paddingTop = this.beaconPositionY === 0 ? this.bubblePadding : vars.beaconPadding;
        const paddingBottom = this.beaconPositionY !== 0 ? this.bubblePadding : vars.beaconPadding;

        const container = {
            width,
            height,
            // center the container around the content
            left: x + ((width - this.bubbleRadius) / 2),
            top: y + ((height - this.bubbleRadius) / 2)
        };

        const outerCircle = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: this.bubbleRadius,
            height: this.bubbleRadius,
            borderRadius: this.bubbleRadius / 2,
            borderColor: vars.beaconBg,
            borderWidth: vars.beaconBorderWidth
        };

        const innerCircle = {
            backgroundColor: 'white',
            borderRadius: this.bubbleRadius / 2,
            width: this.bubbleRadius - 2 * vars.beaconBorderWidth,
            height: this.bubbleRadius - 2 * vars.beaconBorderWidth
        };

        const rectangle = {
            position: 'absolute',
            top: this.beaconPositionY + this.bubbleRadius / 2,
            left: this.beaconPositionX + this.bubbleRadius / 2,
            width: vars.beaconWidth,
            height: this.beaconHeight,
            backgroundColor: vars.beaconBg,
            borderRadius: 8,
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingBottom
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

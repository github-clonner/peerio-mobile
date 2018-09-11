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

const windowHeight = Dimensions.get('window').height;

const textStyle = {
    fontSize: vars.font.size.smaller,
    color: 'white'
};

/** Beacon position relies on setting uiState.beaconContent
 *  uiState.beaconContent = {
 *      x: contentRef.pageX,
 *      y: contentRef.pageY,
 *      width: contentRef.frameWidth,
 *      height: contentRef.frameHeight,
 *      positionX: (0-3) // TODO determine positionX based on content ? automate?
 */

@observer
export default class Beacon extends SafeComponent {
    bubbleRadius = 32; // TODO determine Radius based on content ?
    beaconPositionX;
    beaconPositionY;

    get beaconHeight() {
        const { textHeader, textLine1, textLine2, textLine3 } = this.props;
        let numLines = 0;

        // count number of lines to determine beacon height
        const contentArr = [textHeader, textLine1, textLine2, textLine3];
        contentArr.forEach((line) => { if (line) numLines++; });

        return (numLines * vars.beaconLineHeight) + (2 * vars.beaconPadding) + (this.bubbleRadius / 2);
    }

    @action.bound
    async onPress() {
        const { id } = this.props;
        User.current.beacons.set(id, true);
        await User.current.saveBeacons();
        beaconState.removeBeacon(id);
    }

    renderThrow() {
        const { beaconPosition, textHeader, textLine1, textLine2, textLine3 } = this.props;

        if (!beaconPosition || !textHeader || !textLine1) return null;

        const { pageX: x, pageY: y, frameWidth: width, frameHeight: height } = beaconPosition();
        const positionX = 2; // TODO

        // set beacon position Y based on whether content is in the upper or lower half of the screen
        this.beaconPositionY = (windowHeight / 2 >= y) ? 0 : -this.beaconHeight;
        this.beaconPositionX = -vars.beaconWidth * positionX / 3;

        // set padding between bubble and text based on where the bubble is positioned
        this.bubblePadding = vars.beaconPadding + this.bubbleRadius / 2;
        const paddingLeft = positionX === 0 ? this.bubblePadding : vars.beaconPadding;
        const paddingRight = positionX === 3 ? this.bubblePadding : vars.beaconPadding;
        const paddingTop = this.beaconPositionY === 0 ? this.bubblePadding : vars.beaconPadding;
        const paddingBottom = this.beaconPositionY !== 0 ? this.bubblePadding : vars.beaconPadding;

        const container = {
            position: 'absolute',
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
        // TODO have only 1 component for header and 1 component for Text
        return (
            <TouchableOpacity
                onPress={this.onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={container}>
                <View style={rectangle}>
                    {textHeader && <Text bold style={[textStyle, { paddingBottom: vars.beaconPadding }]}>{textHeader}</Text>}
                    {textLine1 && <Text semibold={!textLine3 || !textHeader} style={textStyle}>{textLine1}</Text>}
                    {textLine2 && <Text semibold={!textLine3 || !textHeader} style={textStyle}>{textLine2}</Text>}
                    {textLine3 && <Text style={textStyle}>{textLine3}</Text>}
                </View>
                <View style={outerCircle}>
                    <View style={innerCircle} />{/* Replace with mock content */}
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

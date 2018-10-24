import React from 'react';
import { observer } from 'mobx-react/native';
import { Image, TouchableOpacity } from 'react-native';
import vars from '../../styles/vars';
import icons from '../helpers/icons';
import beaconState from '../beacons/beacon-state';
import MeasureableView from '../shared/measureable-view';

@observer
export default class MeasureableIcon extends MeasureableView {
    onMeasure = (position) => {
        const { beacon, onPress, spotBgColor } = this.props;
        if (!beacon) {
            console.log('MeasureableIcon: ignoring empty beacon');
            return;
        }
        beacon.position = position;
        beacon.content = this.content;
        beacon.onPressIcon = onPress;
        beacon.spotBgColor = spotBgColor;
        beaconState.requestBeacon(beacon);
    };

    componentWillUnmount() {
        if (this.props.beacon) beaconState.removeBeacon(this.props.beacon.id);
    }

    get content() {
        const { iconSource, icon, color, testId } = this.props;
        if (iconSource) {
            return (
                <Image
                    source={iconSource}
                    style={{ width: vars.iconSize, height: vars.iconSize }}
                />
            );
        }
        return icons.plain(icon, undefined, color, testId);
    }

    renderThrow() {
        const { onPress } = this.props;
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.pressRetentionOffset}
                onPress={onPress}>
                <MeasureableView onMeasure={this.props.beacon ? this.onMeasure : null}>
                    {this.content}
                </MeasureableView>
            </TouchableOpacity>

        );
    }
}

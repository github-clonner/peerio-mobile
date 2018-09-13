import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import beaconState from '../beacons/beacon-state';
import vars from '../../styles/vars';

@observer
export default class MeasureableIcon extends SafeComponent {
    layout = () => {
        const { beacon, icon, onPress } = this.props;
        if (beacon) {
            this.ref.measure(
                (frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
                    console.log(`frameWidth: ${frameWidth}, frameHeight: ${frameHeight}, pageX: ${pageX}, pageY: ${pageY}`);
                    beacon.position = { frameWidth, frameHeight, pageX, pageY };
                    beacon.content = icons.plain(icon, undefined, vars.peerioBlue);
                    beacon.onPressIcon = onPress;
                    // color of tab container
                    beacon.spotBgColor = vars.darkBlueBackground15;
                    beaconState.requestBeacon(beacon);
                });
        }
    };

    // TODO clean up mock beacons
    // ---------------------
    componentWillUnmount() {
        if (this.props.beacon) beaconState.removeBeacon(this.props.beacon.id);
    }

    setRef = ref => { this.ref = ref; };

    renderThrow() {
        return (
            <View
                onLayout={this.layout}
                ref={this.setRef}>{/* TODO clean up mock beacons */}
                {icons.plain(this.props.icon, undefined, this.props.color)}
            </View>
        );
    }
}

import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import beaconState from './beacon-state';

const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
};

@observer
export default class BeaconLayout extends SafeComponent {
    renderThrow() {
        const { activeBeacon } = beaconState;
        if (!activeBeacon) return null;
        console.log(`position: ${activeBeacon.position}`);
        return (
            <View style={style}>
                {/* this way we are creating a component and transferring all properties
                    preserving observables */}
                <activeBeacon.component {...activeBeacon} />
            </View>
        );
    }
}

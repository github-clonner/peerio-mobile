import React from 'react';
import { when, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import beaconState from '../beacons/beacon-state';
import tabBeacons from '../beacons/tab-beacons';

@observer
export default class HeaderIconBase extends SafeComponent {
    icon = '';
    action = () => { };
    disabled = false;
    beacon = null;
    @observable layoutLoaded = false;

    async componentDidMount() {
        when(() => this.layoutLoaded, () => {
            if (this.beacon) {
                beaconState.requestBeacons(this.beacon);
            }
        });
    }

    componentWillUnmount() {
        if (this.beacon) {
            beaconState.removeBeacon(this.beacon.id);
        }
    }

    setRef = ref => {
        this.viewRef = ref;
    };

    layout = () => {
        if (this.beacon) {
            this.viewRef.measure(
                (frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
                    tabBeacons.positionMap.set(this.beacon.id, { frameWidth, frameHeight, pageX, pageY });
                    this.layoutLoaded = true;
                });
        }
    };

    renderThrow() {
        return (
            <View
                style={[{ flex: 0, opacity: this.disabled ? 0.5 : 1 }, this.style]}
                onLayout={this.layout}>
                <TouchableOpacity
                    onPress={this.disabled ? null : this.action}
                    activeOpacity={this.disabled ? 0.5 : 1}
                    {...testLabel(this.props.testID)} >
                    <View style={[{
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        margin: vars.headerIconMargin
                    }, this.innerStyle]}
                    ref={this.setRef}>
                        {icons.plainWhite(this.icon)}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

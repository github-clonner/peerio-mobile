import PropTypes from 'prop-types';
import React from 'react';
import { when, action, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import fileState from '../files/file-state';
import routerMain from '../routes/router-main';
import icons from '../helpers/icons';
import testLabel from '../helpers/test-label';
import uiState from './ui-state';
import beaconState from '../beacons/beacon-state';
import tabBeacons from '../beacons/tab-beacons';

const actionCellStyle = {
    flex: 1,
    borderWidth: 1,
    borderColor: 'green',
    alignItems: 'center',
    height: vars.tabCellHeight,
    justifyContent: 'center'
};

const actionTextStyle = {
    color: vars.white
};

@observer
export default class TabItem extends SafeComponent {
    @observable layoutLoaded = false;

    @action.bound onPressTabItem() {
        const { route } = this.props;
        if (routerMain.route === route && uiState.currentScrollView) {
            if (routerMain.route === 'files') fileState.goToRoot();
            uiState.emit(uiState.EVENTS.HOME);
        } else {
            routerMain[route]();
        }
    }

    // TODO clean up mock beacons
    // ---------------------
    async componentDidMount() {
        when(() => this.layoutLoaded, () => {
            if (this.props.beacon) {
                beaconState.requestBeacons(this.props.beacon);
            }
        });
    }

    componentWillUnmount() {
        if (this.props.beacon) {
            beaconState.removeBeacon(this.props.beacon.id);
        }
    }

    setRef = ref => {
        this.viewRef = ref;
    };

    layout = () => {
        if (this.props.beacon) {
            this.viewRef.measure(
                (frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
                    console.log(`frameWidth: ${frameWidth}, frameHeight: ${frameHeight}, pageX: ${pageX}, pageY: ${pageY}`);
                    tabBeacons.positionMap.set(this.props.beacon.id, { frameWidth, frameHeight, pageX, pageY });
                    this.layoutLoaded = true;
                });
        }
    };
    // ---------------------

    renderThrow() {
        const { text, route, icon, bubble, highlightList } = this.props;
        let color = vars.tabsFg;
        if ((routerMain.route === route) || (highlightList && highlightList.includes(routerMain.route))) {
            color = vars.peerioBlue;
        }
        const indicator = bubble ? (
            <View style={{ position: 'absolute', right: -5, top: 0 }}>
                {icons.bubble('')}
            </View>
        ) : null;
        return (
            <TouchableOpacity
                {...testLabel(icon)}
                onPress={this.onPressTabItem}
                pressRetentionOffset={vars.retentionOffset}
                style={actionCellStyle}>
                <View
                    onLayout={this.layout} // TODO clean up mock beacons
                    pointerEvents="none" style={{ alignItems: 'center' }}>
                    <View
                        ref={this.setRef} // TODO clean up mock beacons
                        style={{ borderWidth: 1, borderColor: 'yellow' }}>
                        {icons.plain(icon, undefined, color)}
                    </View>
                    <Text style={[actionTextStyle, { color }]}>{text}</Text>
                    {indicator}
                </View>
            </TouchableOpacity>
        );
    }
}

TabItem.propTypes = {
    text: PropTypes.any,
    route: PropTypes.any,
    icon: PropTypes.any,
    bubble: PropTypes.any,
    highlightList: PropTypes.any
};

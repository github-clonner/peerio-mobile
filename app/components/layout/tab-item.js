import PropTypes from 'prop-types';
import React from 'react';
import { action } from 'mobx';
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

const actionCellStyle = {
    flex: 1,
    alignItems: 'center',
    height: vars.tabCellHeight,
    justifyContent: 'center'
};

const actionTextStyle = {
    color: vars.white
};

@observer
class MeasureableIcon extends SafeComponent {
    layout = () => {
        const { beacon, icon } = this.props;
        if (beacon) {
            this.ref.measure(
                (frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
                    console.log(`frameWidth: ${frameWidth}, frameHeight: ${frameHeight}, pageX: ${pageX}, pageY: ${pageY}`);
                    beacon.position = { frameWidth, frameHeight, pageX, pageY };
                    beacon.content = icons.plain(icon, undefined, vars.peerioBlue);
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

@observer
export default class TabItem extends SafeComponent {
    @action.bound onPressTabItem() {
        const { route } = this.props;
        if (routerMain.route === route && uiState.currentScrollView) {
            if (routerMain.route === 'files') fileState.goToRoot();
            uiState.emit(uiState.EVENTS.HOME);
        } else {
            routerMain[route]();
        }
    }

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
                    pointerEvents="none" style={{ alignItems: 'center' }}>
                    <MeasureableIcon {...this.props} color={color} />
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

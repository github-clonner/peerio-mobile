import React from 'react';
import { observable } from 'mobx';
import Beacon from './beacon';
import { tx } from '../utils/translator';
import uiState from '../layout/ui-state';
import routerMain from '../routes/router-main';

class TabBeacons {
    @observable positionMap = observable.map();

    get chatBeacon() {
        const id = 'mobile-chat-icon';
        const condition = () => routerMain.route === 'chats' && !uiState.isFirstLogin;
        const component = (
            <Beacon
                id={id}
                beaconPosition={() => this.positionMap.get(id)}
                textHeader={tx('title_contacts')}
                textLine1={tx('title_findContacts')}
            />
        );
        return { id, component, condition };
    }

    get contactBeacon() {
        const id = 'mobile-contact-icon';
        const condition = () => routerMain.route.toLowerCase().includes('contact') && !uiState.isFirstLogin;
        const component = (
            <Beacon
                id={id}
                beaconPosition={() => this.positionMap.get(id)}
                textHeader={tx('title_contacts')}
                textLine1={tx('title_findContacts')}
            />
        );
        return { id, component, condition };
    }
}

const tabBeacons = new TabBeacons();
module.exports = tabBeacons;

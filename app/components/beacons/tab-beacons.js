import { observable } from 'mobx';
import Beacon from './beacon';
import uiState from '../layout/ui-state';
import routerMain from '../routes/router-main';

class TabBeacons {
    get chatBeacon() {
        const condition = () => routerMain.route === 'chats' && !uiState.isFirstLogin;
        return observable({
            id: 'mobile-chat-icon',
            component: Beacon,
            textHeader: 'title_contacts',
            textLine1: 'title_findContacts',
            condition,
            position: null
        });
    }

    get contactBeacon() {
        const condition = () => routerMain.route.toLowerCase().includes('contact') && !uiState.isFirstLogin;
        return observable({
            id: 'mobile-contact-icon',
            component: Beacon,
            textHeader: 'title_contacts',
            textLine1: 'title_findContacts',
            position: null,
            condition
        });
    }
}

const tabBeacons = new TabBeacons();

// TODO: remove before merging
global.tabBeacons = tabBeacons;

module.exports = tabBeacons;

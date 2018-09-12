import { observable } from 'mobx';
import Beacon from './beacon';
import uiState from '../layout/ui-state';
import routes from '../routes/routes';

class TabBeacons {
    get chatBeacon() {
        const condition = () => true;
        return observable({
            id: 'mobile-chat-icon',
            order: 5,
            component: Beacon,
            textHeader: 'title_contacts',
            textLine1: 'title_findContacts',
            condition,
            position: null
        });
    }

    get fileBeacon() {
        const condition = () => true;
        return observable({
            id: 'mobile-file-tab',
            order: 3,
            component: Beacon,
            textHeader: 'title_files_beacon',
            textLine1: 'description_files_beacon',
            position: null,
            condition
        });
    }

    get contactBeacon() {
        const condition = () => true;
        return observable({
            id: 'mobile-contact-icon',
            order: 1,
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

import { observable } from 'mobx';
import Beacon from './beacon';
import uiState from '../layout/ui-state';
import routes from '../routes/routes';

class TabBeacons {
    get chatBeacon() {
        const condition = () => routes.main.route === 'chats' && !uiState.isFirstLogin;
        return observable({
            id: 'mobile-chat-icon',
            component: Beacon,
            textHeader: 'title_contacts',
            textLine1: 'title_findContacts',
            condition,
            position: null
        });
    }

    get fileBeacon() {
        const condition = () => routes.main.route.toLowerCase().includes('file') && !uiState.isFirstLogin;
        return observable({
            id: 'mobile-file-tab',
            component: Beacon,
            textHeader: 'title_files_beacon',
            textLine1: 'description_files_beacon',
            position: null,
            condition
        });
    }

    get contactBeacon() {
        const condition = () => routes.main.route.toLowerCase().includes('contact') && !uiState.isFirstLogin;
        return observable({
            id: 'mobile-contact-icon',
            component: Beacon,
            textHeader: 'title_contacts',
            textLine1: 'title_findContacts',
            position: null,
            condition
        });
    }

    get startChatBeacon() {
        const condition = () => true;
        return observable({
            id: 'mobile-start-dm',
            component: Beacon,
            textHeader: 'title_contacts',
            textLine1: 'title_findContacts',
            position: null,
            condition
        });
    }

    get uploadFileBeacon() {
        const condition = () => true;
        return observable({
            id: 'mobile-upload-file',
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

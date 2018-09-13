import { observable } from 'mobx';
import Beacon from './beacon';
import routes from '../routes/routes';


class TabBeacons {
    get chatBeacon() {
        const condition = () => routes.main.route === 'chats';
        return observable({
            id: 'mobile-chat-icon',
            component: Beacon,
            textHeader: 'title_contacts',
            textDescription: 'title_findContacts',
            condition,
            position: null
        });
    }

    get filesBeacon() {
        const condition = () => routes.main.route === 'files';
        return observable({
            id: 'mobile-files-icon',
            component: Beacon,
            textHeader: 'title_contacts',
            textDescription: 'title_findContacts',
            position: null,
            condition
        });
    }

    get contactBeacon() {
        const condition = () => routes.main.route.toLowerCase().includes('contact');
        return observable({
            id: 'mobile-contact-icon',
            component: Beacon,
            textHeader: 'title_contacts',
            textDescription: 'title_findContacts',
            position: null,
            condition
        });
    }

    get settingsBeacon() {
        const condition = () => routes.main.route === 'settings';
        return observable({
            id: 'mobile-settings-icon',
            component: Beacon,
            textHeader: 'title_contacts',
            textDescription: 'title_findContacts',
            position: null,
            condition
        });
    }
}

const tabBeacons = new TabBeacons();

// TODO: remove before merging
global.tabBeacons = tabBeacons;

module.exports = tabBeacons;

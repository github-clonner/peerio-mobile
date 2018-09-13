import { observable } from 'mobx';
import AreaBeacon from './area-beacon';
import routes from '../routes/routes';


class TabBeacons {
    get chatBeacon() {
        const condition = () => routes.main.route === 'chats';
        return observable({
            id: 'mobile-chat-icon',
            component: AreaBeacon,
            headerText: 'title_contacts',
            descriptionText: 'title_findContacts',
            condition,
            pointerDirection: 'down',
            position: null
        });
    }

    get filesBeacon() {
        const condition = () => routes.main.route === 'files';
        return observable({
            id: 'mobile-files-icon',
            component: AreaBeacon,
            headerText: 'title_contacts',
            descriptionText: 'title_findContacts',
            position: null,
            pointerDirection: 'down',
            condition
        });
    }

    get contactBeacon() {
        const condition = () => routes.main.route.toLowerCase().includes('contact');
        return observable({
            id: 'mobile-contact-icon',
            component: AreaBeacon,
            headerText: 'title_contacts',
            descriptionText: 'title_findContacts',
            position: null,
            pointerDirection: 'down',
            condition
        });
    }

    get settingsBeacon() {
        const condition = () => routes.main.route === 'settings';
        return observable({
            id: 'mobile-settings-icon',
            component: AreaBeacon,
            headerText: 'title_contacts',
            descriptionText: 'title_findContacts',
            position: null,
            pointerDirection: 'down',
            condition
        });
    }
}

const tabBeacons = new TabBeacons();

// TODO: remove before merging
global.tabBeacons = tabBeacons;

module.exports = tabBeacons;

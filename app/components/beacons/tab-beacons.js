import { observable } from 'mobx';
import Beacon from './beacon';
// import routes from '../routes/routes';


class TabBeacons {
    get chatBeacon() {
        const condition = () => true;
        return observable({
            id: 'mobile-chat-icon',
            order: 5,
            component: Beacon,
            textHeader: 'title_chat_beacon',
            textDescription: 'description_chat_beacon',
            condition,
            position: null
        });
    }

    get filesBeacon() {
        const condition = () => true;
        return observable({
            id: 'mobile-files-icon',
            order: 3,
            component: Beacon,
            textHeader: 'title_files_beacon',
            textDescription: 'description_files_beacon',
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
            textHeader: 'title_contact_beacon',
            textDescription: 'description_contact_beacon',
            position: null,
            condition
        });
    }

    // get settingsBeacon() {
    //     const condition = () => routes.main.route === 'settings';
    //     return observable({
    //         id: 'mobile-settings-icon',
    //         component: Beacon,
    //         textHeader: 'title_contacts',
    //         textDescription: 'title_findContacts',
    //         position: null,
    //         condition
    //     });
    // }
}

const tabBeacons = new TabBeacons();

// TODO: remove before merging
global.tabBeacons = tabBeacons;

module.exports = tabBeacons;

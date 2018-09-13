import { observable } from 'mobx';
import Beacon from './beacon';

class TabBeacons {
    get chatBeacon() {
        const condition = () => true;
        return observable({
            id: 'mobile-chat-icon',
            priority: 5,
            flow: 'onboarding',
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
            priority: 3,
            flow: 'onboarding',
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
            priority: 1,
            flow: 'onboarding',
            component: Beacon,
            textHeader: 'title_contact_beacon',
            textDescription: 'description_contact_beacon',
            position: null,
            condition
        });
    }
}

const tabBeacons = new TabBeacons();

// TODO: remove before merging
global.tabBeacons = tabBeacons;

module.exports = tabBeacons;

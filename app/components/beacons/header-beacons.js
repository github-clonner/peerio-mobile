import { observable } from 'mobx';
import Beacon from './beacon';
import routes from '../routes/routes';

class HeaderBeacons {
    get startChatBeacon() {
        const condition = () => routes.main.route === 'chats';
        return observable({
            id: 'mobile-start-dm',
            order: 6,
            component: Beacon,
            textHeader: 'title_startChat_beacon',
            textDescription: 'description_startChat_beacon',
            position: null,
            condition
        });
    }

    get uploadFileBeacon() {
        const condition = () => routes.main.route.toLowerCase().includes('file');
        return observable({
            id: 'mobile-upload-file',
            order: 4,
            component: Beacon,
            textHeader: 'title_uploadFiles_beacon',
            textDescription: 'description_uploadFiles_beacon',
            position: null,
            condition
        });
    }

    get addContactBeacon() {
        const condition = () => routes.main.route.toLowerCase().includes('contact');
        return observable({
            id: 'mobile-addContact-file',
            order: 2,
            component: Beacon,
            textHeader: 'title_search_beacon',
            textDescription: 'description_search_beacon',
            position: null,
            condition
        });
    }
}

const headerBeacons = new HeaderBeacons();

module.exports = headerBeacons;

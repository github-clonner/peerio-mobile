import { observable } from 'mobx';
import Beacon from './beacon';
import routes from '../routes/routes';

class HeaderBeacons {
    get startChatBeacon() {
        const condition = () => routes.main.route === 'chats';
        return observable({
            id: 'mobile-start-dm',
            component: Beacon,
            textHeader: 'title_startChat_beacon',
            textLine1: 'description_startChat_beacon',
            position: null,
            condition
        });
    }

    get uploadFileBeacon() {
        const condition = () => routes.main.route.toLowerCase().includes('file');
        return observable({
            id: 'mobile-upload-file',
            component: Beacon,
            textHeader: 'title_uploadFiles_beacon',
            textLine1: 'description_uploadFiles_beacon',
            position: null,
            condition
        });
    }
}

const headerBeacons = new HeaderBeacons();

module.exports = headerBeacons;

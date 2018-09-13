import { observable } from 'mobx';
import Beacon from './beacon';
import routes from '../routes/routes';
import uiState from '../layout/ui-state';
import chatStore from '../../lib/peerio-icebear/models/chats/chat-store';
import fileStore from '../../lib/peerio-icebear/models/files/file-store';
import contactStore from '../../lib/peerio-icebear/models/contacts/contact-store';

class HeaderBeacons {
    get startChatBeacon() {
        const condition = () => (uiState.isFirstLogin && routes.main.route === 'chats') || chatStore.chats.length === 0;
        return observable({
            id: 'mobile-start-dm',
            priority: 6,
            component: Beacon,
            textHeader: 'title_startChat_beacon',
            textDescription: 'description_startChat_beacon',
            position: null,
            condition
        });
    }

    get uploadFileBeacon() {
        const condition = () => (uiState.isFirstLogin && routes.main.route.toLowerCase().includes('file')) || fileStore.files.length === 0;
        return observable({
            id: 'mobile-upload-file',
            priority: 4,
            component: Beacon,
            textHeader: 'title_uploadFiles_beacon',
            textDescription: 'description_uploadFiles_beacon',
            position: null,
            condition
        });
    }

    get addContactBeacon() {
        const condition = () => (uiState.isFirstLogin && routes.main.route.toLowerCase().includes('contact')) || contactStore.contacts.length === 0;
        return observable({
            id: 'mobile-addContact',
            priority: 2,
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

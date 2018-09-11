import React from 'react';
import { observable } from 'mobx';
import Beacon from './beacon';
import { tx } from '../utils/translator';
import uiState from '../layout/ui-state';
import routes from '../routes/routes';

class TabBeacons {
    @observable positionMap = observable.map();

    get chatBeacon() {
        const id = 'mobile-chat-tab';
        const condition = () => routes.main.route === 'chats' && !uiState.isFirstLogin;
        const component = (
            <Beacon
                id={id}
                beaconPosition={() => this.positionMap.get(id)}
                textHeader={tx('title_chat_beacon')}
                textLine1={tx('description_chat_beacon')}
            />
        );
        return { id, component, condition };
    }

    get fileBeacon() {
        const id = 'mobile-file-tab';
        const condition = () => routes.main.route.toLowerCase().includes('file') && !uiState.isFirstLogin;
        const component = (
            <Beacon
                id={id}
                beaconPosition={() => this.positionMap.get(id)}
                textHeader={tx('title_files_beacon')}
                textLine1={tx('description_files_beacon')}
            />
        );
        return { id, component, condition };
    }

    get contactBeacon() {
        const id = 'mobile-contact-tab';
        const condition = () => routes.main.route.toLowerCase().includes('contact') && !uiState.isFirstLogin;
        const component = (
            <Beacon
                id={id}
                beaconPosition={() => this.positionMap.get(id)}
                textHeader={tx('title_contact_beacon')}
                textLine1={tx('description_contact_beacon')}
            />
        );
        return { id, component, condition };
    }

    get startChatBeacon() {
        const id = 'mobile-start-dm';
        const condition = () => true;
        const component = (
            <Beacon
                id={id}
                beaconPosition={() => this.positionMap.get(id)}
                textHeader={tx('title_contact_beacon')}
                textLine1={tx('description_contact_beacon')}
            />
        );
        return { id, component, condition };
    }

    get uploadFileBeacon() {
        const id = 'mobile-upload-file';
        const condition = () => true;
        const component = (
            <Beacon
                id={id}
                beaconPosition={() => this.positionMap.get(id)}
                textHeader={tx('title_uploadFiles_beacon')}
                textLine1={tx('description_uploadFiles_beacon')}
            />
        );
        return { id, component, condition };
    }
}

const tabBeacons = new TabBeacons();
module.exports = tabBeacons;

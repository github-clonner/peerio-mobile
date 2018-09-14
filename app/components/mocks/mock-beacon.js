import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import PopupLayout from '../layout/popup-layout';
import ChatList from '../messaging/chat-list';
import ContactList from '../contacts/contact-list';
import SettingsLevel1 from '../settings/settings-level-1';
import Files from '../files/files';
import ChannelInvite from '../messaging/channel-invite';
import { User } from '../../lib/icebear';
import chatState from '../messaging/chat-state';
import contactState from '../contacts/contact-state';
import mockChatStore from './mock-chat-store';
import { vars } from '../../styles/styles';
import mockContactStore from './mock-contact-store';
import mockFileStore from './mock-file-store';
import TabContainer from '../layout/tab-container';
import BeaconLayout from '../beacons/beacon-layout';
import routes from '../routes/routes';

@observer
export default class MockBeacon extends Component {
    componentWillMount() {
        User.current = mockContactStore.createMock();
        User.current.activePlans = [];
        mockFileStore.install();
        chatState.store = mockChatStore;
        chatState.init();
        contactState.store = mockContactStore;
        contactState.init();
        routes.main.route = 'contacts';
    }

    get list() {
        const { route } = routes.main;
        switch (route) {
            case 'channelInviteList': return <ChannelInvite />;
            case 'settings': return <SettingsLevel1 />;
            case 'chats': return <ChatList />;
            case 'contacts': return <ContactList />;
            case 'files': return <Files />;
            default: return null;
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1, paddingTop: vars.layoutPaddingTop }}>
                {this.list}
                <TabContainer />
                <PopupLayout key="popups" />
                <StatusBar barStyle="default" />
                <BeaconLayout />
            </View>
        );
    }
}

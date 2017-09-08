import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { observable } from 'mobx';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import SafeComponent from '../shared/safe-component';
import LayoutModalExit from '../layout/layout-modal-exit';
import Avatar from '../shared/avatar';
import chatState from '../messaging/chat-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { popupCancelConfirm } from '../shared/popups';
import { tx, tu } from '../utils/translator';

const textStyle = {
    color: vars.txtDate,
    marginTop: 10,
    fontSize: 12,
    marginLeft: 18,
    fontWeight: 'bold'
};

const deleteMessage =
`If you delete the channel, you will no longer be able to access the shared files and chat history`;

@observer
export default class ChannelInfo extends SafeComponent {
    @observable channelTopic = '';
    @observable chat = null;

    componentDidMount() {
        this.chat = chatState.currentChat;
        this.channelTopic = this.chat.purpose;
    }

    leaveChannel = async () => {
        if (await popupCancelConfirm(tx('button_leaveChannel'), tx('title_confirmChannelLeave'))) {
            await this.chat.leave();
            chatState.routerModal.discard();
        }
    }

    deleteChannel = async () => {
        if (await popupCancelConfirm(tx('button_deleteChannel'), deleteMessage)) {
            await this.chat.delete();
            chatState.routerModal.discard();
        }
    }

    lineBlock(content, noBorder) {
        const s = {
            borderBottomWidth: noBorder ? 0 : 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        return (
            <View style={s}>{content}</View>
        );
    }

    action(title, icon, action) {
        return (
            <TouchableOpacity pressRetentionOffset={vars.retentionOffset} onPress={action}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {icons.dark(icon, action)}
                    <Text>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    participant = (contact, i) => {
        const { chat } = this;
        const { username } = contact;
        const row = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexGrow: 1
        };
        const isAdmin = chatState.currentChat.isAdmin(contact);
        return (
            <View key={contact.username} style={row}>
                <View style={{ flex: 1, flexGrow: 1, paddingLeft: 4 }}>
                    <Avatar
                        noBorderBottom
                        contact={contact}
                        key={username || i}
                        message={''}
                        hideOnline />
                </View>
                <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
                    {isAdmin && <View style={{ backgroundColor: vars.bg, borderRadius: 4, padding: 4, overflow: 'hidden' }}>
                        <Text style={{ color: vars.white, fontSize: 10 }}>
                            {tu('title_admin')}
                        </Text>
                    </View>}
                    <Menu>
                        <MenuTrigger
                            renderTouchable={() => <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} />}
                            style={{ padding: vars.iconPadding }}>
                            {icons.plaindark('more-vert')}
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption
                                onSelect={() => (isAdmin ?
                                    chat.demoteAdmin(contact) :
                                    chat.promoteToAdmin(contact))}>
                                <Text>{isAdmin ?
                                    tx('button_demoteAdmin') : tx('button_makeAdmin')}
                                </Text>
                            </MenuOption>
                            <MenuOption
                                onSelect={() => chat.removeParticipant(contact)}>
                                <Text>{tx('button_remove')}</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
            </View>
        );
    }

    topicTextBox() {
        const chat = chatState.currentChat;
        const update = () => {
            chat.changePurpose(this.channelTopic);
        };
        return (
            <View>
                <Text style={textStyle}>{tx('title_channelPurpose')}</Text>
                <TextInput
                    onChangeText={text => { this.channelTopic = text; }}
                    onBlur={update}
                    onEndEditing={update}
                    value={this.channelTopic}
                    style={{ paddingLeft: 18, height: vars.inputHeight, color: vars.txtDark }} />
            </View>
        );
    }

    renderThrow() {
        const chat = chatState.currentChat;
        const body = (
            <View>
                {this.lineBlock(this.topicTextBox())}
                {this.lineBlock(this.action(tx('button_leaveChannel'), 'remove-circle-outline', this.leaveChannel), true)}
                {this.lineBlock(this.action(tx('button_deleteChannel'), 'delete', this.deleteChannel))}
                {chat.participants && this.lineBlock(
                    <View style={{ paddingVertical: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
                            <Text style={[textStyle, { marginBottom: 12 }]}>
                                {tx('title_Members')}
                            </Text>
                            {icons.dark('add-circle-outline', () => chatState.routerModal.channelAddPeople())}
                        </View>
                        {chat.participants.map(this.participant)}
                    </View>
                )}
            </View>
        );
        return (<LayoutModalExit
            body={body}
            title={`# ${chat.name}`}
            onClose={() => chatState.routerModal.discard()} />);
    }
}
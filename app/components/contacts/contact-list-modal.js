import React from 'react';
import { observer } from 'mobx-react/native';
import { View, SectionList } from 'react-native';
import { computed } from 'mobx';
import SafeComponent from '../shared/safe-component';
import ContactsPlaceholder from './contacts-placeholder';
import ProgressOverlay from '../shared/progress-overlay';
import ContactItem from './contact-item';
import ContactSectionHeader from './contact-section-header';
import ChannelListItem from '../messaging/channel-list-item';
import contactState from './contact-state';
import chatState from '../messaging/chat-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import Center from '../controls/center';
import Text from '../controls/custom-text';

const INITIAL_LIST_SIZE = 20;

@observer
export default class ContactListModal extends SafeComponent {
    componentDidMount() {
        contactState.store.uiViewFilter = 'all';
    }

    @computed
    get sections() {
        const { uiView, contacts } = contactState.store;
        const sections = uiView.map(({ letter, items }) => {
            return { data: items, key: letter };
        });
        sections.unshift({ data: [], key: `All (${contacts.length})` });
        const { channels } = chatState.store;
        sections.unshift({ data: channels, key: `Rooms (${channels.length})` });
        return sections;
    }

    item = ({ item }) => {
        const onPress = () => this.props.action(item);
        return item.isChannel ? (
            <ChannelListItem chat={item} channelName={item.name} onPress={onPress} />
        ) : (
            <ContactItem contact={item} onPress={onPress} />
        );
    };

    header({ section: /* data, */ { key } }) {
        return <ContactSectionHeader key={key} title={key} />;
    }

    listView() {
        return (
            <SectionList
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.sections}
                keyExtractor={item => item.username || item.email || item.id}
                renderItem={this.item}
                renderSectionHeader={this.header}
            />
        );
    }

    get contactListComponent() {
        return !contactState.empty
            ? this.listView()
            : !contactState.store.loading && <ContactsPlaceholder />;
    }

    get exitRow() {
        const container = {
            flexDirection: 'row',
            alignItems: 'center',
            padding: vars.spacing.small.mini2x,
            paddingTop: vars.statusBarHeight,
            paddingBottom: 0,
            backgroundColor: vars.white
        };
        const style = {
            flexGrow: 1
        };
        const textStyle = {
            fontSize: vars.font.size14,
            color: 'rgba(0, 0, 0, .54)'
        };
        return (
            <View style={container}>
                {icons.dark('close', this.props.onExit)}
                <Center style={style}>
                    <Text semibold style={textStyle}>
                        {this.props.title}
                    </Text>
                </Center>
                {icons.placeholder()}
            </View>
        );
    }

    renderThrow() {
        return (
            <View style={{ flex: 1, backgroundColor: vars.lightGrayBg }}>
                {this.exitRow}
                <View style={{ flex: 1 }}>{this.contactListComponent}</View>
                <ProgressOverlay enabled={contactState.store.loading} />
            </View>
        );
    }
}

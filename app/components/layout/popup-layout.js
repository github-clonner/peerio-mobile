import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, LayoutAnimation, Platform } from 'react-native';
import { reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import popupState from './popup-state';
import ButtonText from '../controls/button-text';
import { vars } from '../../styles/styles';
import uiState from './ui-state';

const colors = {
    systemWarning: vars.yellowLine
};

@observer
export default class PopupLayout extends SafeComponent {
    componentDidMount() {
        reaction(() => popupState.activePopup, () => LayoutAnimation.easeInEaseOut());
    }

    onPress(item) {
        item.action && item.action();
        popupState.discardPopup();
    }

    button = (item) => {
        const { text, id, secondary, disabled } = item;
        return (
            <ButtonText
                testID={`popupButton_${id}`}
                onPress={() => this.onPress(item)}
                secondary={secondary}
                disabled={disabled}
                key={id}
                text={text} />
        );
    }

    renderThrow() {
        const popup = popupState.activePopup;
        if (!popup) return null;

        const modalStyle = {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };

        const popupNonAnimatedStyle = [modalStyle, {
            justifyContent: 'center',
            backgroundColor: '#00000020',
            transform: [{ translateY: 0 }]
        }];
        const backgroundColor = colors[popup.type];
        const margin = vars.spacing.large.mini2;
        const wrapper = {
            flexGrow: popup.fullScreen,
            backgroundColor,
            borderRadius: 8,
            overflow: 'hidden',
            elevation: 10,
            margin,
            marginHorizontal: vars.spacing.medium.mini2x,
            marginBottom: (Platform.OS === 'android' ? 0 : uiState.keyboardHeight) + margin
        };

        const container = {
            flexGrow: 1,
            borderRadius: 8,
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: {
                height: 1,
                width: 1
            },
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            backgroundColor: vars.white
        };

        const title = {
            fontWeight: 'bold',
            fontSize: vars.font.size.big,
            marginBottom: vars.spacing.small.midi2x,
            color: vars.txtDark
        };

        const buttonBar = {
            flex: 0,
            marginHorizontal: vars.spacing.medium.mini2x,
            marginVertical: vars.spacing.small.midi2x,
            flexDirection: 'row',
            justifyContent: 'flex-end'
        };

        // const sideNote = {
        //     textAlign: 'right',
        //     fontStyle: 'italic'
        // };

        return (
            <View style={popupNonAnimatedStyle}>
                <View style={wrapper}>
                    <View style={container}>
                        <View style={{ padding: vars.spacing.medium.midi2x, flexGrow: 1, flexShrink: 1 }}>
                            {popup.title ? <Text style={title} ellipsizeMode="tail" numberOfLines={1}>{popup.title}</Text> : null}
                            {popup.subTitle}
                            {popup.contents}
                        </View>
                        <View style={buttonBar}>
                            {popup.buttons.map(this.button)}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

PopupLayout.propTypes = {
};

import React from 'react';
import { observer } from 'mobx-react/native';
import { ScrollView, View, Platform } from 'react-native';
import { action, reaction } from 'mobx';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import popupState from './popup-state';
import ButtonText from '../controls/button-text';
import { vars } from '../../styles/styles';
import uiState from './ui-state';
import { transitionAnimation } from '../helpers/animations';

const colors = {
    systemWarning: vars.yellow,
    systemUpgrade: vars.peerioBlue
};

@observer
export default class PopupLayout extends SafeComponent {
    componentDidMount() {
        reaction(() => popupState.activePopup, transitionAnimation);
    }

    onPress(item) {
        item.action && item.action();
        popupState.discardPopup();
    }

    button = item => {
        const { text, id, secondary, disabled } = item;
        return (
            <ButtonText
                onPress={() => this.onPress(item)}
                secondary={secondary}
                disabled={disabled}
                key={id}
                text={text}
                testID={id}
            />
        );
    };

    @action.bound
    scrollViewRef(sv) {
        this.scrollView = sv;
        uiState.currentScrollView = sv;
    }

    renderThrow() {
        const popup = popupState.activePopup;
        if (!popup) return null;

        const modalStyle = {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            zIndex: 16
        };

        const popupNonAnimatedStyle = [
            modalStyle,
            {
                transform: [{ translateY: 0 }]
            }
        ];
        const contentContainerStyle = {
            flexGrow: 1,
            justifyContent: 'center',
            backgroundColor: '#00000020',
            paddingBottom: uiState.keyboardHeight
        };
        const backgroundColor = colors[popup.type];
        const margin = vars.spacing.large.mini2x;
        const wrapper = {
            flexGrow: popup.fullScreen,
            backgroundColor,
            borderRadius: 8,
            overflow: 'hidden',
            elevation: 10,
            margin,
            marginHorizontal: vars.popupHorizontalMargin,
            marginBottom: (Platform.OS === 'android' ? 0 : uiState.keyboardHeight) + margin
        };

        const showWarningLine = popup.type;
        const container = {
            flexGrow: 1,
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: {
                height: 1,
                width: 1
            },
            marginTop: showWarningLine ? 8 : 0,
            borderRadius: !showWarningLine ? 8 : 0,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            backgroundColor: vars.white,
            justifyContent: 'space-between'
        };

        const title = {
            fontSize: vars.font.size18,
            marginBottom: vars.spacing.small.midi2x,
            color: vars.txtDark
        };

        const subTitle = {
            color: vars.subtleText
        };

        const buttonBar = {
            flex: 0,
            marginHorizontal: vars.spacing.medium.mini2x,
            marginVertical: vars.spacing.small.midi2x,
            flexDirection: 'row',
            justifyContent: 'flex-end'
        };

        return (
            // scroll view so clicking outside of textboxes would close keyboard
            <ScrollView
                ref={this.scrollViewRef}
                scrollEnabled={false}
                style={popupNonAnimatedStyle}
                contentContainerStyle={contentContainerStyle}>
                <View style={wrapper}>
                    <View style={container}>
                        <View
                            style={{
                                padding: popup.noPadding ? 0 : vars.popupPadding,
                                flexGrow: 1,
                                flexShrink: 1
                            }}>
                            {popup.title ? (
                                <Text bold style={title}>
                                    {popup.title}
                                </Text>
                            ) : null}
                            {popup.subTitle ? <Text style={subTitle}>{popup.subTitle}</Text> : null}
                            {popup.contents}
                        </View>
                        {popup.buttons && (
                            <View style={buttonBar}>{popup.buttons.map(this.button)}</View>
                        )}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

PopupLayout.propTypes = {};

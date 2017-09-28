import React, { Component } from 'react';
import { View, Text, Image, ScrollView, LayoutAnimation, Dimensions } from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import loginState from './login-state';
import LoginWizardPage, {
    header, inner, padding, title1, title1Black, title2, title2Black, row, circleTop, container, embeddedImageCircleSize
} from './login-wizard-page';
import ActivityOverlay from '../controls/activity-overlay';
import { vars } from '../../styles/styles';

const imageWelcomeFast = require('../../assets/welcome-fast.png');
const imageWelcomePrivate = require('../../assets/welcome-private.png');
const imageWelcomeSafe = require('../../assets/welcome-safe.png');

function scrollItem(title, subtitle, icon) { return { title, subtitle, icon }; }

@observer
export default class LoginStart extends LoginWizardPage {
    progress(current) {
        const count = 3;
        const circles = [];
        const circleSize = 4;
        const circle = {
            backgroundColor: vars.txtMedium,
            margin: circleSize,
            width: circleSize * 2,
            height: circleSize * 2,
            opacity: 0.3,
            borderRadius: circleSize
        };
        const selected = {
            opacity: 1
        };
        for (let i = 0; i < count; ++i) {
            circles.push(
                <View style={[circle, i === current ? selected : null]} key={i} />
            );
        }
        const circleRow = {
            flexDirection: 'row',
            alignSelf: 'center'
        };
        return <View style={circleRow}>{circles}</View>;
    }

    @observable _selected = 0;
    _scrollerWidth = Dimensions.get('window').width - padding * 2;

    handleScroll = event => {
        const x = event.nativeEvent.contentOffset.x;
        this._selected = Math.round(x / this._scrollerWidth);
    }

    _scrollItems = [
        scrollItem('Private', 'Peerio’s end-to-end encryption keeps your data safe from breaches.', imageWelcomePrivate),
        scrollItem('Safe', 'Only you can access your account. Your data is safe and secure 24/7.', imageWelcomeSafe),
        scrollItem('Fast', 'So fast, you’ll forget that everything is always encrypted.', imageWelcomeFast)
    ];

    componentDidMount() {
        reaction(() => this._selected, () => LayoutAnimation.easeInEaseOut());
    }

    render() {
        const scrollStyle = { width: this._scrollerWidth };
        return (
            <View style={container}>
                <View style={header}>
                    <Text style={title1}>Welcome to Peerio</Text>
                    <Text style={title2}>Your private and secure collaboration platform</Text>
                </View>
                <View style={{ flex: 0.7, alignItems: 'center' }}>
                    <ScrollView
                        onScroll={this.handleScroll}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        pagingEnabled
                        style={inner}>
                        {this._scrollItems.map(({ title, subtitle }, i) => (
                            <View style={scrollStyle} key={title}>
                                <View>
                                    <Text style={title1Black}>{title}</Text>
                                    <Text style={title2Black}>{subtitle}</Text>
                                </View>
                                <View style={{ flex: 1, paddingBottom: 20, justifyContent: 'flex-end' }}>
                                    {this.progress(i)}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={circleTop} accessible accessibilityLabel="testLabel">
                        <Image key={this._selected} source={this._scrollItems[this._selected].icon} style={{ width: embeddedImageCircleSize, height: embeddedImageCircleSize }} />
                    </View>
                </View>
                <View style={row}>
                    {this.button('button_login', this.props.login, loginState.isInProgress)}
                    {/* TODO: copy */}
                    {this.button('button_CreateAccount', () => loginState.routes.app.signupStep1(), loginState.isInProgress)}
                </View>
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}

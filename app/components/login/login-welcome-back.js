import React from 'react';
import { View, StatusBar } from 'react-native';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { T, tx } from '../utils/translator';
import loginState from './login-state';
import { vars, signupStyles } from '../../styles/styles';
import SafeComponent from '../shared/safe-component';
import Text from '../controls/custom-text';
import IntroStepIndicator from '../shared/intro-step-indicator';
import LoginInputs from './login-inputs';
import { User, telemetry } from '../../lib/icebear';
import tm from '../../telemetry';
import TmHelper from '../../telemetry/helpers';
import signupState from '../signup/signup-state';
import icons from '../helpers/icons';

const { S } = telemetry;

const marginBottom = 10;
const marginTop = vars.spacing.small.maxi2x;

const titleStyle = {
    fontSize: 24, // TODO: accomodate for iPhone SE
    color: vars.darkBlue,
    marginBottom
};

const subtitleStyle = {
    fontSize: 14, // TODO: accomodate for iPhone SE
    color: vars.textBlack54,
    marginBottom: marginBottom + 10
};

@observer
export default class LoginWelcomeBack extends SafeComponent {
    @observable lastUser;

    async componentDidMount() {
        this.startTime = Date.now();
        TmHelper.currentRoute = S.WELCOME_BACK_SCREEN;
        this.lastUser = await User.getLastAuthenticated();
    }

    componentWillUnmount() {
        tm.login.duration(this.startTime);
    }

    @action.bound onSignupPress() {
        loginState.routes.app.signupStep1();
    }

    @action.bound onLoginPress() {
        loginState.routes.app.loginClean();
    }

    @action.bound switchUserLink(text) {
        const onPress = () => {
            tm.login.changeUser();
            loginState.clearLastUser();
        };
        return (
            <Text style={{ color: vars.peerioBlue }} onPress={onPress}>
                {text}
            </Text>
        );
    }

    @action.bound async onBackPressed() {
        tm.login.navigate(S.BACK);
        signupState.prev();
        await User.removeLastAuthenticated();
    }

    get backButton() {
        return (
            <View style={signupStyles.backButtonContainer}>
                {icons.basic(
                    'arrow-back',
                    vars.darkBlue,
                    this.onBackPressed,
                    { backgroundColor: 'transparent' },
                    null,
                    true,
                    'back')}
            </View>);
    }

    get placeholder() {
        return (
            <View style={signupStyles.page}>
                <IntroStepIndicator max={1} current={1} />
                <View style={signupStyles.container} />
                <StatusBar hidden />
            </View>
        );
    }

    renderThrow() {
        if (!this.lastUser) return this.placeholder;
        return (
            <View style={signupStyles.page}>
                <IntroStepIndicator max={1} current={1} />
                <View style={signupStyles.container}>
                    {this.backButton}
                    <View style={{ marginTop }}>
                        <Text semibold serif style={titleStyle}>
                            {tx('title_welcomeBackFirstname', { firstName: this.lastUser.firstName })}
                        </Text>
                        <T k="title_switchUser" style={subtitleStyle}>
                            {{
                                username: this.lastUser.username,
                                switchUser: this.switchUserLink
                            }}
                        </T>
                    </View>
                    <LoginInputs hideUsernameInput />
                </View>
                <StatusBar hidden />
            </View>
        );
    }
}

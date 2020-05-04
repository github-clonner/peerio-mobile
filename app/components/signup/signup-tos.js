import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Dimensions } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { T, tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import ViewWithDrawer from '../shared/view-with-drawer';
import { TopDrawerBackupAccountKey } from '../shared/top-drawer-components';
import { drawerState } from '../states';
import { socket, telemetry } from '../../lib/icebear';
import routes from '../routes/routes';
import TosAccordion from './tos-accordion';
import { popupTOS, popupPrivacy } from '../shared/popups';
import tm from '../../telemetry';
import BlueButtonText from '../buttons/blue-text-button';
import BlueRoundButton from '../buttons/blue-round-button';

const { S } = telemetry;

const { height } = Dimensions.get('window');

const buttonContainerHeight = 52;

const buttonContainer = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: vars.separatorColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: signupStyles.pagePadding,
    height: buttonContainerHeight,
    backgroundColor: vars.white
};

const sublocation = S.TERMS_OF_USE;

@observer
export default class SignupTos extends SafeComponent {
    componentWillMount() {
        // no other drawers in signup except for backup account key, so we can do it
        drawerState.dismissAll();
    }

    componentDidMount() {
        this.startTime = Date.now();
        if (!signupState.keyBackedUp) {
            drawerState.addDrawer(TopDrawerBackupAccountKey);
        }
    }

    componentWillUnmount() {
        tm.signup.duration({ sublocation, startTime: this.startTime });
    }

    @action.bound
    cancelSignup() {
        tm.signup.navigate({ sublocation, option: S.CANCEL });
        routes.app.signupCancel();
    }

    @action.bound
    finishSignup() {
        tm.signup.acceptTos();
        signupState.next();
    }

    get content() {
        return (
            <View>
                <Text style={signupStyles.description2}>
                    {
                        <T k="title_termsDescription">
                            {{
                                openTerms: this.openTermsLink,
                                openPrivacy: this.openPrivacyLink
                            }}
                        </T>
                    }
                </Text>
                <TosAccordion style={{ paddingBottom: buttonContainerHeight }} />
            </View>
        );
    }

    @action.bound
    openTermsLink(text) {
        const onPress = async () => {
            tm.signup.readMorePopup({ item: S.TERMS_OF_USE });
            await popupTOS();
        };
        return (
            <Text style={{ color: vars.peerioBlue }} onPress={onPress}>
                {text}
            </Text>
        );
    }

    @action.bound
    openPrivacyLink(text) {
        const onPress = async () => {
            tm.signup.readMorePopup({ item: S.PRIVACY_POLICY });
            await popupPrivacy();
        };
        return (
            <Text style={{ color: vars.peerioBlue }} onPress={onPress}>
                {text}
            </Text>
        );
    }

    renderThrow() {
        return (
            <View>
                <ViewWithDrawer style={[signupStyles.page, { height }]}>
                    <View style={signupStyles.container2}>
                        <Text semibold serif style={signupStyles.headerStyle2}>
                            {tx('title_termsOfUseSentenceCase')}
                        </Text>
                        {this.content}
                    </View>
                </ViewWithDrawer>
                <View style={buttonContainer}>
                    <BlueButtonText
                        text="button_decline"
                        onPress={this.cancelSignup}
                        disabled={!socket.connected}
                        accessibilityId="button_decline"
                    />
                    <View style={{ width: 24 }} />
                    <BlueRoundButton
                        text="button_accept"
                        accessibilityId="button_accept"
                        onPress={this.finishSignup}
                        disabled={!socket.connected}
                    />
                </View>
            </View>
        );
    }
}

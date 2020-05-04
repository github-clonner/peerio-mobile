import React from 'react';
import { reaction, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { ScrollView, View, Clipboard, ActivityIndicator, Keyboard } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import snackbarState from '../snackbars/snackbar-state';
import { tx } from '../utils/translator';
import { popup2FA } from '../shared/popups';
import { clientApp, User } from '../../lib/icebear';
import loginState from '../login/login-state';
import TwoFactorAuthCodes from './two-factor-auth-codes';
import TwoFactorAuthCodesGenerate from './two-factor-auth-codes-generate';
import uiState from '../layout/ui-state';
import testLabel from '../helpers/test-label';
import tm from '../../telemetry';
import TextInputUncontrolled from '../controls/text-input-uncontrolled';
import fonts from '../../styles/fonts';
import BlueButtonText from '../buttons/blue-text-button';

const paddingVertical = vars.listViewPaddingVertical;
const paddingHorizontal = vars.listViewPaddingHorizontal;
const marginVertical = vars.spacing.medium.midi;
const marginBottom = vars.spacing.small.midi2x;

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical,
    paddingHorizontal,
    backgroundColor: vars.darkBlueBackground05
};

const labelStyle = {
    color: vars.txtDate,
    marginBottom
};

const whiteStyle = {
    backgroundColor: vars.white,
    paddingTop: vars.spacing.small.maxi,
    paddingHorizontal
};

async function twoFactorAuthPopup(active2FARequest) {
    if (!active2FARequest) return;
    console.log(JSON.stringify(active2FARequest));
    const { submit, cancel, type } = active2FARequest;
    // result returns true if 2fa code was entered, false if popup was canceled
    const result = await popup2FA(
        tx('title_2FAInput'),
        tx('title_2FAHelperText'),
        type === 'login' ? tx('title_verifyDeviceTwoWeeks') : null,
        uiState.trustDevice2FA,
        true,
        type === 'disable'
    );
    if (result === false) {
        if (type === 'login') {
            await loginState.signOut(true);
        }
        cancel();
        return;
    }
    const { value, checked } = result;
    uiState.trustDevice2FA = checked;
    try {
        await submit(value, checked);
    } catch (e) {
        console.error(e);
        uiState.tfaFailed = true;
        if (type === 'login') tm.login.onUserTfaLoginFailed(User.current.autologinEnabled);
    }
}

reaction(
    () => clientApp.active2FARequest,
    active2FARequest => {
        loginState.tfaRequested = active2FARequest.type === 'login';
        twoFactorAuthPopup(active2FARequest);
    }
);

export { twoFactorAuthPopup };

@observer
export default class TwoFactorAuth extends SafeComponent {
    @observable key2fa;
    @observable confirmCode;
    @observable backupCodes;
    @observable showReissueCodes;

    async componentWillMount() {
        try {
            this.key2fa = await User.current.setup2fa();
            __DEV__ && console.log(`two-factor-auth.js: ${this.key2fa}`);
        } catch (e) {
            // TODO: remove it and depend on SDK
            if (e.code === 400) {
                console.log('two-factor-auth.js: already enabled');
                User.current.twoFAEnabled = true;
            }
        }
        if (User.current.twoFAEnabled) {
            this.showReissueCodes = true;
        }
    }

    copyKey = () => {
        Clipboard.setString(this.key2fa);
        snackbarState.pushTemporary('2FA key has been copied to clipboard');
    };

    confirm = async () => {
        Keyboard.dismiss();
        const { confirmCode } = this;
        this.confirmCode = null;
        this.backupCodes = await User.current.confirm2faSetup(confirmCode, true);
    };

    get key2FAControl() {
        if (!this.key2fa) return <ActivityIndicator />;
        return (
            <Text bold {...testLabel('secretKey')}>
                {this.key2fa}
            </Text>
        );
    }

    onChangeText = text => {
        this.confirmCode = text;
    };

    renderThrow() {
        if (this.showReissueCodes) return <TwoFactorAuthCodesGenerate />;
        if (this.backupCodes) return <TwoFactorAuthCodes codes={this.backupCodes} />;
        return (
            <ScrollView style={bgStyle} keyboardShouldPersistTaps="handled">
                <View>
                    <Text style={{ color: vars.txtDark }}>{tx('title_2FADetailDesktop')}</Text>
                </View>
                <View style={{ marginVertical }}>
                    <Text style={labelStyle}>{tx('title_2FASecretKey')}</Text>
                    <View style={whiteStyle}>
                        {this.key2FAControl}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end'
                            }}>
                            <BlueButtonText
                                text="button_2FACopyKey"
                                onPress={this.copyKey}
                                disabled={!this.key2fa}
                            />
                        </View>
                    </View>
                </View>
                <View>
                    <Text>{tx('title_2FAHelperText')}</Text>
                </View>
                <View style={{ marginVertical }}>
                    <Text style={labelStyle}>{tx('title_2FACode')}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            backgroundColor: vars.white,
                            paddingHorizontal
                        }}>
                        <TextInputUncontrolled
                            style={{
                                color: vars.txtDark,
                                marginVertical: vars.spacing.small.midi2x,
                                height: vars.inputHeight,
                                flexGrow: 1,
                                fontFamily: fonts.peerioFontFamily
                            }}
                            {...testLabel('confirmationCodeInput')}
                            placeholderTextColor={vars.txtDate}
                            placeholder={tx('title_2FAHelperText')}
                            onChangeText={this.onChangeText}
                            value={this.confirmCode}
                        />
                        <BlueButtonText
                            text="button_confirm"
                            onPress={this.confirm}
                            disabled={!this.confirmCode || !this.key2fa}
                            accessibilityId="button_confirm"
                        />
                    </View>
                </View>
                <View>
                    <Text style={{ color: vars.txtDark }}>{tx('title_authAppsDetails')}</Text>
                </View>
            </ScrollView>
        );
    }
}

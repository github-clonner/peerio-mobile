import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation, telemetry } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import CheckBox from '../shared/checkbox';
import SignupButtonBack from './signup-button-back';
import SignupHeading from './signup-heading';
import SignupStepIndicator from './signup-step-indicator';
import tm from '../../telemetry';
import BlueRoundButton from '../buttons/blue-round-button';

const { S } = telemetry;

const { validators } = validation;
const { email } = validators;

const checkboxContainer = {
    marginBottom: vars.spacing.small.maxi
};

const sublocation = S.ACCOUNT_EMAIL;

const tmEmail = {
    item: S.EMAIL,
    location: S.ONBOARDING,
    sublocation
};

@observer
export default class SignupStep3 extends SafeComponent {
    emailState = observable({ value: '' });
    @action.bound
    emailInputRef(ref) {
        this.emailInput = ref;
    }

    componentDidMount() {
        this.startTime = Date.now();
        // QUICK SIGNUP DEV FLAG
        if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
            const rnd = new Date().getTime() % 100000;
            this.emailInput.onChangeText(`${rnd}@test`);
        }
        // fill fields when returning from another step
        if (signupState.email) {
            this.emailState.value = signupState.email;
            this.emailInput.onChangeText(this.emailState.value);
        }
    }

    componentWillUnmount() {
        tm.signup.duration({ sublocation, startTime: this.startTime });
    }

    @action
    tmToggleChecked() {
        tm.signup.toggleNewsletterCheckbox(signupState.subscribeToPromoEmails);
    }

    @action.bound
    handleCreateButton() {
        if (this.isCreateDisabled) return;
        signupState.email = this.emailState.value;
        signupState.next();
        tm.signup.navigate({ sublocation, option: S.CREATE });
    }

    get isCreateDisabled() {
        return !socket.connected || !this.emailState.value || !this.emailInput.isValid;
    }

    renderThrow() {
        const buttonMarginTop = vars.isDeviceScreenBig
            ? vars.spacing.large.minix
            : vars.spacing.small.maxi;
        return (
            <View style={signupStyles.page}>
                <SignupStepIndicator />
                <View style={signupStyles.container}>
                    <SignupButtonBack telemetry={{ sublocation, option: S.BACK }} />
                    <SignupHeading
                        title="title_createYourAccount"
                        subTitle="title_whatIsYourEmail"
                    />
                    <StyledTextInput
                        autoFocus
                        state={this.emailState}
                        validations={email}
                        telemetry={tmEmail}
                        label={`${tx('title_email')}*`}
                        helperText={tx('title_hintEmail')}
                        lowerCase
                        keyboardType="email-address"
                        returnKeyType="next"
                        onSubmitEditing={this.handleCreateButton}
                        placeholder={tx('title_emailPlaceholderSignup')}
                        required
                        clearTextIcon
                        ref={this.emailInputRef}
                        testID="email"
                    />
                    <View style={[signupStyles.separator, { marginBottom: 0 }]} />
                    <View style={checkboxContainer}>
                        <CheckBox
                            alignLeft
                            state={signupState}
                            onChange={this.tmToggleChecked}
                            property="subscribeToPromoEmails"
                            text={tx('title_subscribeNewsletter')}
                            accessibilityLabel={tx('title_subscribeNewsletter')}
                        />
                    </View>
                    <View style={{ alignItems: 'flex-end', marginTop: buttonMarginTop }}>
                        <BlueRoundButton
                            text="button_create"
                            accessibilityId="button_create"
                            onPress={this.handleCreateButton}
                            disabled={this.isCreateDisabled}
                            style={{ width: vars.signupButtonWidth, marginVertical: 30 }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

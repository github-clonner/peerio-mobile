import React, { Component } from 'react';
import {
    Text,
    View,
    Linking
} from 'react-native';
import { observer } from 'mobx-react/native';
import TextBox from '../controls/textbox';
import LanguagePickerBox from '../controls/language-picker-box';
import SignupFooter from '../controls/signup-footer';
import Layout1 from '../layout/layout1';
import styles from '../../styles/styles';
import signupState from './signup-state';
import forms from '../helpers/forms';

@observer
export default class SignupStep1 extends Component {
    constructor(props) {
        super(props);
        forms.mixin(this, signupState);
        this.terms = this.terms.bind(this);
    }

    terms() {
        Linking.openURL('https://www.peerio.com/');
    }

    render() {
        const style = styles.wizard;
        const body = (
            <View style={style.containerFlex}>
                <Text style={style.text.title}>Signup</Text>
                <Text style={style.text.subTitle}>Profile</Text>
                <TextBox
                    valid={signupState.usernameValid}
                    {...this.tb('username', 'Username')} />
                <TextBox
                    valid={signupState.emailValid}
                    {...this.tb('email', 'Email')} />
                <LanguagePickerBox {...this.tb('language', 'Language')} />
                <Text style={style.text.info}>
                    By creating a <Text style={{ fontWeight: 'bold' }}>Peerio</Text> account you agree to
                    our <Text style={{ textDecorationLine: 'underline' }} onPress={this.terms}>terms of service</Text>
                </Text>
                <View style={{ flex: 1 }} />
            </View>
        );

        return (
            <Layout1 body={body} footer={<SignupFooter />} />
        );
    }
}

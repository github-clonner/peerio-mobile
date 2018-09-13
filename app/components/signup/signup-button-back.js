import React from 'react';
import { observer } from 'mobx-react/native';
import signupState from './signup-state';
import SafeComponent from '../shared/safe-component';
import ButtonBack from '../shared/button-back';

@observer
export default class SignupButtonBack extends SafeComponent {
    renderThrow() {
        return <ButtonBack onBackPressed={signupState.prev} />;
    }
}

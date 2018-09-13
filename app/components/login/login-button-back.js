import React from 'react';
import { observer } from 'mobx-react/native';
import ButtonBack from '../shared/button-back';
import SafeComponent from '../shared/safe-component';
import loginState from './login-state';

@observer
export default class LoginButtonBack extends SafeComponent {
    renderThrow() {
        return <ButtonBack onBackPressed={loginState.clearLastUser} />;
    }
}

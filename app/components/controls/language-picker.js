import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import PickerPopup from './picker-popup';
import uiState from '../layout/ui-state';
import { transitionAnimation } from '../helpers/animations';

@observer
export default class LanguagePicker extends SafeComponent {
    constructor(props) {
        super(props);
        this.data = uiState.languages;
    }

    componentWillUpdate() {
        transitionAnimation();
    }

    renderThrow() {
        return (
            <PickerPopup
                name="languageSelected"
                onValueChange={this.onValueChange}
                data={this.data}
                state={uiState} />
        );
    }
}

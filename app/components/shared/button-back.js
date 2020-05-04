import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import SafeComponent from '../shared/safe-component';
import vars from '../../styles/vars';

const source = require('../../assets/buttons/signup-back-icon.png');

@observer
export default class ButtonBack extends SafeComponent {
    renderThrow() {
        return icons.imageButtonNoPadding(
            source,
            this.props.onBackPressed,
            vars.iconSizeMedium,
            null,
            'button_back'
        );
    }
}

import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import Text from './custom-text';

export interface ButtonTextProps {
    text?: string,
    textColor?: string,
    testID?: string,
    onPress?: VoidFunction,
    secondary?: boolean,
    style?: StyleProp<TextStyle>,
    disabled?: boolean
}

@observer
export default class ButtonText extends SafeComponent<ButtonTextProps> {
    renderThrow() {
        const { text, style, textColor, secondary, disabled, onPress, testID } = this.props;
        let fontColor;
        if (disabled) fontColor = vars.extraSubtleText;
        else if (secondary) fontColor = vars.subtleText;
        else if (textColor) fontColor = textColor;
        else fontColor = vars.peerioBlue;
        const padding = vars.spacing.small.maxi2x;
        const touchable: ViewStyle = {
            padding,
            justifyContent: 'center'
        };

        return (
            <TouchableOpacity
                {...testLabel(`popupButton-${testID}`)}
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                pressRetentionOffset={vars.retentionOffset}
                style={touchable}
                disabled={disabled}
                onPress={disabled ? null : onPress}>
                <Text bold style={[style, { color: fontColor }]}>
                    {text.toUpperCase ? text.toUpperCase() : text}
                </Text>
            </TouchableOpacity>
        );
    }
}

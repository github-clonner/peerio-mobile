import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import Text from './custom-text';
import { vars } from '../../styles/styles';

export interface ButtonProps {
    style?: ViewStyle,
    textStyle?: TextStyle,
    onPress?: Function,
    text: string,
    caps?: boolean,
    disabled?: boolean,
    accessible?: boolean,
    accessibilityLabel?: string,
    testID?: string,
    bold?: boolean
}

@observer
export default class Button extends Component<ButtonProps> {
    render() {
        const { textStyle } = this.props;
        const opacity = { opacity: this.props.disabled ? 0.5 : 1 };
        const text = this.props.text || '';
        const press = () => {
            !this.props.disabled && this.props.onPress && this.props.onPress();
            return true;
        };
        const offset = vars.retentionOffset;
        return (
            <TouchableOpacity
                pressRetentionOffset={offset}
                onPress={press}
                accessible={this.props.accessible}
                accessibilityLabel={this.props.accessibilityLabel}
                testID={this.props.testID}>
                <View style={this.props.style}>
                    <Text
                        bold={this.props.bold}
                        style={[
                            { backgroundColor: 'transparent', color: vars.highlight },
                            textStyle,
                            opacity
                        ]}>
                        {text}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

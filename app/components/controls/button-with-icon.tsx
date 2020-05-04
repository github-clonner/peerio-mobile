import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from './custom-text';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';

export interface ButtonWithIconProps {
    style?: ViewStyle,
    textStyle?: TextStyle,
    color?: string,
    onPress?: Function,
    text?: string,
    caps?: boolean,
    disabled?: boolean,
    testID?: string,
    bold?: boolean,
    iconName?: string,
    accessible?: boolean,
    accessibilityLabel?: string
}

const defaultTextStyle: TextStyle = {
    backgroundColor: 'transparent'
};

const containerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
};

@observer
export default class ButtonWithIcon extends Component<ButtonWithIconProps> {
    render() {
        const { textStyle, color } = this.props;
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
                {...testLabel(this.props.accessibilityLabel)}>
                <View style={[this.props.style, containerStyle]}>
                    <Icon
                        style={{ paddingHorizontal: 7 }}
                        name={this.props.iconName}
                        size={vars.iconSize}
                        color={color || 'gray'}
                    />
                    <Text
                        bold={this.props.bold}
                        style={[{ color: vars.highlight }, defaultTextStyle, textStyle, opacity]}>
                        {text}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}


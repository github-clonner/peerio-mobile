import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { StyleProp, TextStyle } from 'react-native';
import Text from './custom-text';

@observer
export default class Bold extends Component<{ children: JSX.Element, style?: StyleProp<TextStyle> }> {
    render() {
        return (
            <Text bold style={this.props.style}>
                {this.props.children}
            </Text>
        );
    }
}

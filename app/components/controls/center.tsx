import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ViewStyle, } from 'react-native';

@observer
export default class Center extends Component<{ children: JSX.Element, style?: ViewStyle }> {
    render() {
        const style: ViewStyle = {
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        };
        return <View style={[style, this.props.style]}>{this.props.children}</View>;
    }
}


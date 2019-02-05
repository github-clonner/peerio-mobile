import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ViewStyle } from 'react-native';

@observer
export default class Bottom extends Component<{ children: JSX.Element }> {
    render() {
        const style: ViewStyle = {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
        };
        return (
            <View pointerEvents="box-none" style={style}>
                {this.props.children}
            </View>
        );
    }
}

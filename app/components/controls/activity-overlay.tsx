import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator, ViewStyle } from 'react-native';
import { vars } from '../../styles/styles';

@observer
export default class ActivityOverlay extends Component<{ visible?: boolean, large?: boolean }> {
    render() {
        const center: ViewStyle = {
            justifyContent: 'center',
            alignItems: 'center'
        };
        const activityOverlay: ViewStyle = {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: '#FFFFFF50'
        };
        return this.props.visible ? (
            <View style={[activityOverlay, center]}>
                <ActivityIndicator
                    size={this.props.large ? 'large' : 'small'}
                    color={vars.txtDark}
                />
            </View>
        ) : null;
    }
}
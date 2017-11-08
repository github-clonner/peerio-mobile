import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';

export default class CircleButtonWithIcon extends Component {
    render() {
        const iconStyle = {
            backgroundColor: this.props.bgColor,
            borderRadius: 15,
            overflow: 'hidden',
            width: this.props.radius,
            height: this.props.radius,
            marginHorizontal: this.props.margin,
            alignItems: 'center',
            justifyContent: 'center'
        };
        return (
            <TouchableOpacity>
                <View style={iconStyle}>
                    {icons.basic(
                        this.props.name,
                        this.props.iconColor,
                        this.props.onPress,
                        {},
                        vars.iconSize,
                        true
                        )}
                </View>
            </TouchableOpacity>
        );
    }
}

CircleButtonWithIcon.propTypes = {
    name: PropTypes.any,
    iconColor: PropTypes.any,
    onPress: PropTypes.any,
    radius: PropTypes.any,
    margin: PropTypes.any,
    bgColor: PropTypes.any
};

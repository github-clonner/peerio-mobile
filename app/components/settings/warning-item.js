import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

const container = {
    marginHorizontal: vars.spacing.medium.midi2x,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: vars.spacing.small.maxi2x
};

const textStyle = {
    overflow: 'hidden'
};

@observer
export default class WarningItem extends SafeComponent {
    renderThrow() {
        return (
            <View style={container}>
                <Icon
                    style={{ paddingHorizontal: vars.spacing.medium.mini2x }}
                    name="warning"
                    size={vars.iconSize}
                    color="gray"
                />
                <View style={textStyle}>
                    <Text>
                        {this.props.content}
                    </Text>
                    {this.props.linkContent}
                </View>
            </View>
        );
    }
}

WarningItem.propTypes = {
    icon: PropTypes.any,
    content: PropTypes.any,
    linkContent: PropTypes.any,
    link: PropTypes.any
};

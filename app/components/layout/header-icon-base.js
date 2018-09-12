import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import MeasureableIcon from './measureable-icon';

const itemStyle = {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: vars.headerIconMargin
};

@observer
export default class HeaderIconBase extends SafeComponent {
    icon = '';
    action = () => { };
    disabled = false;
    beacon = null;

    renderThrow() {
        return (
            <View style={[{ flex: 0, opacity: this.disabled ? 0.5 : 1 }, this.style]}>
                <TouchableOpacity
                    pressRetentionOffset={vars.retentionOffset}
                    onPress={this.disabled ? null : this.action}
                    activeOpacity={this.disabled ? 0.5 : 1}
                    {...testLabel(this.props.testID)} >
                    <View style={[itemStyle, this.innerStyle]} >
                        <MeasureableIcon
                            icon={this.icon}
                            color={vars.white}
                            beacon={this.beacon} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

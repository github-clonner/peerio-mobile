import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import MeasureableIcon from './measureable-icon';

@observer
export default class HeaderIconBase extends SafeComponent {
    icon = '';
    action = () => { };
    disabled = false;

    renderThrow() {
        return (
            <View
                style={[{ flex: 0, opacity: this.disabled ? 0.5 : 1 }, this.style]}
                onLayout={this.layout}>
                <TouchableOpacity
                    onPress={this.disabled ? null : this.action}
                    activeOpacity={this.disabled ? 0.5 : 1}
                    {...testLabel(this.props.testID)}>
                    <MeasureableIcon {...this.props} />
                    <View style={[{
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        margin: vars.headerIconMargin
                    }, this.innerStyle]} >
                        {icons.plainWhite(this.icon)}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

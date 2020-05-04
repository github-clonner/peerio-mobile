import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import RadioButton from './radio-button';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';

const radioText = {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 4
};

@observer
export default class RadioGroup extends SafeComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: -1
        };
    }

    _onSelect(index) {
        const { onSelect } = this.props;
        this.setState({
            selectedIndex: index
        });
        onSelect(index);
    }

    render() {
        const { selectedIndex } = this.state;
        const targetIndex = selectedIndex !== -1 ? selectedIndex : this.props.defaultSelect;

        const views = this.props.options.map((text, index) => (
            <RadioButton
                key={text}
                onPress={() => this._onSelect(index)}
                isSelected={index === targetIndex}>
                <View style={radioText}>
                    <Text style={{ color: vars.textBlack87 }}>{tx(text)}</Text>
                </View>
            </RadioButton>
        ));

        return <View>{views}</View>;
    }
}

RadioGroup.defaultProps = {
    defaultSelect: -1
};

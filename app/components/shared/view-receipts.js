import PropTypes from 'prop-types';
import React from 'react';
import { View, LayoutAnimation } from 'react-native';
import { reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import ReadReceipt from './read-receipt';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import Text from '../controls/custom-text';

const receiptRow = {
    backgroundColor: vars.black25,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 40,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 16,
    paddingHorizontal: 1
};

const textStyle = {
    fontSize: vars.readReceiptFontSize,
    color: vars.darkBlue
};

@observer
export default class ViewReceipts extends SafeComponent {
    componentDidMount() {
        const { receipts } = this.props;
        this._observer = reaction(() => receipts && receipts.length,
            () => LayoutAnimation.easeInEaseOut());
    }

    componentWillUnmount() {
        this._observer();
    }

    receiptLabel(receipts, keepAvatar) {
        if (receipts.length === 1 || keepAvatar) {
            return <ReadReceipt username={receipts[0].username} />;
        }
        if (receipts.length < 10) {
            return <Text style={textStyle}>{receipts.length}</Text>;
        }
        return <Text style={textStyle}>9+</Text>;
    }

    renderThrow() {
        const { receipts, keepAvatar } = this.props;
        if (!receipts || !receipts.length) return <View style={receiptRow} />;

        return (
            <View style={receiptRow}>
                {icons.plain('remove_red_eye', vars.iconSizeSmall, vars.darkBlue)}
                {this.receiptLabel(receipts, keepAvatar)}
            </View>
        );
    }
}

ViewReceipts.propTypes = {
    receipts: PropTypes.any
};

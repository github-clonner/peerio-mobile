import PropTypes from 'prop-types';
import React from 'react';
import { View, LayoutAnimation } from 'react-native';
import { reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import ReadReceipt from './read-receipt';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';

const receiptRow = {
    backgroundColor: 'red',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 0,
    marginRight: vars.spacing.small.mini2x,
    width: 48
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

    renderThrow() {
        const { receipts } = this.props;
        if (!receipts || !receipts.length) return null;

        return (
            <View style={receiptRow}>
                {icons.plain('remove_red_eye', vars.iconSizeSmall, vars.darkBlue)}
                <ReadReceipt username={receipts[0].username} />
            </View>
        );
    }
}

ViewReceipts.propTypes = {
    receipts: PropTypes.any
};

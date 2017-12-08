import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import FilePreview from '../files/file-share-preview';
import { tx } from '../utils/translator';

@observer
export default class MockImagePreview extends Component {
    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1, paddingTop: vars.layoutPaddingTop }}>
                <FilePreview />
                { /* <StatusBar barStyle="default" /> */}
            </View>
        );
    }
}
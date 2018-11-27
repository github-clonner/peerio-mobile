import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import InlineUrlContainer from '../messaging/inline-url-container';

const externalWebsite = {
    type: 'html',
    url: 'https://www.peerio.com',
    siteName: 'Peerio',
    title:
        'Secure Team Communication & Cloud File Storage Secure Team Communication & Cloud File Storage',
    description: 'Secure team chat, cloud storage, and file management. All in one place.',
    favicon: {
        url: require('../../assets/peerio-logo-dark.png')
    },
    image: {
        url: require('../../assets/peerio-logo-dark.png')
    }
};

@observer
export default class MockUrlPreview extends Component {
    render() {
        return (
            <View style={{ margin: 16 }}>
                <InlineUrlContainer externalWebsite={externalWebsite} />
            </View>
        );
    }
}

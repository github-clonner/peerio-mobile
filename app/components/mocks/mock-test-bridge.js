/* eslint-disable no-eval */
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import io from 'socket.io-client/dist/socket.io';
import Text from '../controls/custom-text';
import mockLog from './mock-log';
import TestBridgeWebSocket from '../../../test/listener/test-bridge-web-socket';

@observer
export default class MockTestBridge extends Component {
    componentDidMount() {
        mockLog.inject();
        this.testBridge = new TestBridgeWebSocket(io.connect);
    }

    componentWillUnmount() {
        mockLog.free();
    }

    render() {
        return (
            <View style={{ flexGrow: 1 }}>
                <ScrollView style={{ flexGrow: 1, padding: 20 }}>
                    <Text>WS test listener bridge:</Text>
                    <Text>{mockLog.list}</Text>
                </ScrollView>
            </View>
        );
    }
}

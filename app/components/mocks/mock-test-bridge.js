/* eslint-disable no-eval */
import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import io from 'socket.io-client/dist/socket.io';
import Text from '../controls/custom-text';
import mockLog from './mock-log';

class TestBridgeWebSocket {
    constructor() {
        this.socket = new io.connect(
            'ws://192.168.0.163:1337',
            {
                reconnection: true,
                timeout: 1000,
                autoConnect: false,
                transports: ['websocket'],
                forceNew: true
            }
        );

        this.socket.on('connect', () => {
            console.log('\ud83d\udc9a Test socket connected.');
            this.connected = true;
        });

        this.socket.on('disconnect', reason => {
            console.log('\ud83d\udc94 Test socket disconnected.');
            this.connected = false;
        });

        this.socket.on('connect_error', err => {
            console.error('Connect error', err);
        });
        this.socket.on('connect_timeout', timeout => {
            console.error('Connect timeout', timeout);
        });
        this.socket.on('error', err => {
            console.error('Socket error', err);
        });

        this.socket.open();
    }
}

// @observer
export default class MockTestBridge extends Component {
    db = null;

    componentDidMount() {
        console.log = mockLog.log;
        this.startTest();
        this.testBridge = new TestBridgeWebSocket();
        setInterval(() => this.forceUpdate(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    async startTest() {
        console.log('init');
        console.log(`eval test: ${eval('5 + 5')}`);
    }

    render() {
        return (
            <View style={{ flexGrow: 1 }}>
                <View style={{ justifyContent: 'flex-start', flexGrow: 1, padding: 20 }}>
                    <Text>WS test listener bridge:</Text>
                    <Text>{mockLog.list}</Text>
                </View>
            </View>
        );
    }
}

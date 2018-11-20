/* eslint-disable no-eval */
const io = require('socket.io-client');

class TestBridgeWebSocket {
    constructor() {
        this.socket = new io.connect('ws://192.168.0.163:1337');

        this.socket.on('connect', () => {
            console.log('\ud83d\udc9a Test socket connected.');
            this.connected = true;
        });

        this.socket.on('disconnect', reason => {
            console.log(`\ud83d\udc94 Test socket disconnected. ${reason}`);
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

        this.socket.on('message', message => {
            console.log(`${new Date()}: incoming message`);
            console.log(message);
            try {
                const { id, data } = message;
                const result = eval(data);
                const timestamp = new Date().getTime();
                console.log(result);
                this.socket.emit('message', {
                    id,
                    timestamp,
                    data: result
                });
            } catch (e) {
                console.error(e);
            }
        });

        this.socket.open();
    }
}

// eslint-disable-next-line
const testBridgeWebSocket = new TestBridgeWebSocket();

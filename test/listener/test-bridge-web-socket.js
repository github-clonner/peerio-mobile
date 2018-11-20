/* eslint-disable no-eval */

function test() {
    return new Promise(resolve => {
        setTimeout(() => resolve(1000), 3000);
    });
}

class TestBridgeWebSocket {
    constructor(websocketClientClass) {
        this.socket = new websocketClientClass('ws://192.168.0.163:1337');

        this.socket.on('connect', () => {
            console.log('🤖 test socket connected.');
        });

        this.socket.on('disconnect', reason => {
            console.log(`🤖 test socket disconnected. ${reason}`);
        });

        // we don't want to spam in our application log with this
        /* this.socket.on('connect_error', err => {
            console.error('🤖 connect error', err);
        }); */

        this.socket.on('connect_timeout', timeout => {
            console.error('🤖 connect timeout', timeout);
        });

        this.socket.on('error', err => {
            console.error('🤖 socket error', err);
        });

        this.socket.on('message', async message => {
            console.log(`🤖 ${new Date()}: incoming message`);
            console.log(message);
            let id = null;
            let error = null;
            let result = null;
            try {
                if (!message) {
                    throw new Error('Message is empty');
                }
                id = message.id;
                if (!id) {
                    throw new Error('Message id is empty');
                }
                const { data } = message;
                if (!data) {
                    throw new Error('Message data is empty');
                }
                result = eval(data);
                if (result && result.then) {
                    console.log('Result is a promise, awaiting result');
                    result = await result;
                }
                console.log(result);
            } catch (e) {
                console.error(e);
                error = e.message;
            }
            const timestamp = new Date().getTime();
            this.socket.emit('message', {
                id,
                timestamp,
                data: result,
                error
            });
        });

        console.log('🤖 test socket: waiting for connection.');
        this.socket.open();
    }
}

module.exports = TestBridgeWebSocket;

const process = require('process');
const readline = require('readline');
// Port where we'll run the websocket server
const webSocketsServerPort = process.env.TEST_LISTENER_PORT || 1337;
// websocket and http servers
const http = require('http');

const server = http.createServer(() => {});

const io = require('socket.io')(server);

server.listen(webSocketsServerPort, function() {
    console.log(`${new Date()} Server is listening on port ${webSocketsServerPort}`);
});

const messageMap = {};
let index = 0;

function formatAndSaveMessage(data) {
    const id = `${++index}`;
    const timestamp = new Date().getTime();
    const message = {
        id,
        timestamp,
        data
    };
    messageMap[id] = message;
    return message;
}

// event fired every time a new client connects:
io.on('connection', socket => {
    console.log(`Client connected [id=${socket.id}]`);

    // when socket disconnects, remove it from the list:
    socket.on('message', message => {
        console.log(`Incoming message`);
        console.log(message);
    });
    // when socket disconnects, remove it from the list:
    socket.on('disconnect', () => {
        console.log(`Client gone [id=${socket.id}]`);
    });
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt() {
    rl.question('test-cli > ', line => {
        if (line === 'quit') {
            io.close();
            rl.close();
            server.close();
            return;
        }
        if (line.trim()) {
            io.emit('message', formatAndSaveMessage(line));
        }
        // TODO: Log the answer in a database
        // console.log(`Thank you for your valuable feedback: ${line}`);
        prompt();
    });
}

prompt();

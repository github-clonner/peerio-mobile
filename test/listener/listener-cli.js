// Port where we'll run the websocket server
const webSocketsServerPort = 1337;
// websocket and http servers
const webSocketServer = require('websocket').server;
const http = require('http');

const clients = [];

const server = http.createServer(function (/* request, response */) {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
});
server.listen(webSocketsServerPort, function () {
    console.log(`${new Date()} Server is listening on port ${webSocketsServerPort}`);
});
/**
 * WebSocket server
 */
const wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket
    // request is just an enhanced HTTP request. For more info
    // http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function (request) {
    console.log(`${new Date()} Connection from origin ${request.origin}`);
    // accept connection - you should check 'request.origin' to
    // make sure that client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    const connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    // const currentConnectionIndex = clientIndex++;
    clients.push(connection);
    console.log(`${new Date()} Connection accepted.`);
    // user sent some message
    connection.on('message', function (message) {
        if (message.type === 'utf8') { // accept only text
            console.log(JSON.stringify(message));
        }
    });
    // user disconnected
    connection.on('close', closeConnection => {
        console.log(`${new Date()} Peer ${closeConnection.remoteAddress} disconnected.`);
        // TODO: remove from connection list
    });
});

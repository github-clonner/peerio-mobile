import { reaction } from 'mobx';
import './btoa-shim';
import rnFileStream from './rn-file-stream';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';
global.cryptoShim = require('react-native-crypto');

const Promise = require('bluebird');

Promise.config({
    // Enables all warnings except forgotten return statements.
    warnings: {
        wForgottenReturn: false
    }
});

const icebear = require('./peerio-icebear/src');

const { socket, config, FileStreamAbstract, serverWarnings } = icebear;

reaction(() => serverWarnings.collection.length, (l) => {
    console.log('icebear.js: server warning update');
    if (l) {
        console.log('icebear.js: server warning cleared');
        const sw = serverWarnings.collection[l - 1];
        sw && sw.action && sw.action();
    }
});

config.socketServerUrl = process.env.PEERIO_SOCKET_SERVER || 'wss://app.peerio.com';
socket.start();

rnFileStream(FileStreamAbstract);

module.exports = icebear;

global.icebear = icebear;

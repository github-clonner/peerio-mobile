import './btoa-shim';
import mobileConfig from './mobile-config';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';

const icebear = require('./peerio-icebear');

const { socket, config, FileStreamAbstract } = icebear;
mobileConfig(config, { FileStreamAbstract });

console.log(`icebear.js: Starting connection to ${config.socketServerUrl}`);
socket.start();

global.icebear = icebear;
module.exports = icebear;

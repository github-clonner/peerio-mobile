var blacklist = require('metro/src/blacklist')

var config = {
  getBlacklistRE() {
    return blacklist([
        /app\/lib\/peerio-icebear\/node_modules\/.*/
    ]);
  }
};
console.log('loading custom config for packager');
module.exports = config;

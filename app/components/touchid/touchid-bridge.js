import { observable, action } from 'mobx';
import TouchID from 'react-native-touch-id-value';

const touchid = observable({
    available: null,

    load: action.bound(async function() {
        this.available = await TouchID.isFeatureAvailable();
        console.log(`touchid-bridge.js: ${touchid.available}`);
    }),

    save(key, value) {
        console.log(`touchid-bridge.js: saving ${key}:${value.length}`);
        return TouchID.save(key, value).catch(e => {
            console.log(`touchid-bridge.js: error saving ${key}`);
            console.error(e);
        });
    },

    get(key) {
        console.log(`touchid-bridge.js: requesting ${key}`);
        return TouchID.get(key).catch(e => {
            console.log(`touchdid-bridge.js: returned error from ${key}`);
            console.log(e);
            return Promise.resolve(null);
        });
    }
});

export default touchid;

import loginState from '../login/login-state';

const { observable, reaction } = require('mobx');
const { TinyDb, User, warnings, clientApp } = require('../../lib/icebear');

class PreferenceStore {
    // stored with 'pref_' prefix in tinydb
    @observable
    prefs = {
        doNotDisturbModeEnabled: false,
        allActivityNotifsEnabled: true,
        directNotifsEnabled: true,
        displayMessageContentEnabled: true,
        allActivitySoundsEnabled: true,
        allEmailNotifsEnabled: true,
        newMessageEmailNotifsEnabled: true,
        limitInlineImageSize: true, // will use config.chat.inlineImageSizeLimit
        externalContentConsented: false, // false - no feedback from user yet, true - user expressed their desire
        externalContentEnabled: true,
        externalContentJustForFavs: false,
        peerioContentEnabled: true,
        showMoveSharedFolderPopup: true,
        importContactsInBackground: false,
        pendingFilesBannerVisible: true,
        lastTimeSawMaintenanceNotice: null
    };

    async observePreference(key, dbName, localStore) {
        const prefKey = `pref_${key}`;
        try {
            const loadedValue = await TinyDb[dbName].getValue(prefKey);
            if (loadedValue || loadedValue === false) {
                localStore[key] = loadedValue;
            }
            reaction(
                () => localStore[key],
                () => {
                    TinyDb[dbName].setValue(prefKey, localStore[key]);
                }
            );
        } catch (e) {
            console.error(e);
        }
    }

    @observable loaded = false;
    async init() {
        if (this.loaded || this.loading) return;
        this.loading = true;
        await Promise.all(
            Object.keys(this.prefs).map(key => {
                return this.observePreference(key, 'user', this.prefs);
            })
        );

        reaction(() => User.current.deleted, loginState.signOut);

        reaction(
            () => User.current.blacklisted,
            blacklisted => {
                if (blacklisted) {
                    warnings.addSevere(
                        'error_accountSuspendedText',
                        'error_accountSuspendedTitle',
                        null,
                        async () => {
                            await loginState.signOut();
                        }
                    );
                }
            }
        );

        this.loading = false;
        this.loaded = true;
    }
}

const preferenceStore = new PreferenceStore();
clientApp.uiUserPrefs = preferenceStore.prefs;
global.preferenceStore = preferenceStore;
export default preferenceStore;

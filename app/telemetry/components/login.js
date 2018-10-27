import { telemetry } from '../../lib/icebear';
import { setup } from '../main';

const { S, duration, errorMessage } = telemetry;

const login = setup(
    {
        duration: (tm) => {
            return [
                S.DURATION,
                {
                    location: S.SIGN_IN,
                    sublocation: tm.sublocation,
                    totalTime: duration(tm.startTime)
                }
            ];
        },

        onNavigateLogin: () => {
            return [
                S.NAVIGATE, {
                    option: S.SIGN_IN,
                    location: S.ONBOARDING,
                    sublocation: S.WELCOME_SCREEN
                }
            ];
        },

        navigate: (tm) => {
            return [
                S.NAVIGATE,
                {
                    option: tm.option,
                    location: S.SIGN_IN,
                    sublocation: tm.sublocation
                }
            ];
        },

        onLoginSuccess: () => {
            return [
                S.SIGN_IN, { text: S.SIGN_IN }
            ];
        },

        onLoginWithEmail: (tm, errorMsg) => {
            return [
                S.TEXT_INPUT,
                {
                    item: tm.item,
                    location: tm.location,
                    sublocation: tm.sublocation,
                    state: S.ERROR,
                    errorType: errorMessage(errorMsg)
                }
            ];
        },

        toggleAkVisibility: (isVisible) => {
            return [
                S.TOGGLE_VISIBILITY,
                {
                    location: S.SIGN_IN,
                    visible: isVisible,
                    item: S.ACCOUNT_KEY
                }
            ];
        },

        changeUser: () => {
            return [S.CHANGE_USER];
        }
    }
);

module.exports = login;

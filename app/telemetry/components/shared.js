import { telemetry } from '../../lib/icebear';
import { setup } from '../main';
import TmHelper from '../helpers';

const { S, errorMessage } = telemetry;

/*
    These are the events for components that are shared between multiple views. Since they can appear
    in more than one place, they need to know TmHelper.currentRoute for the `Sublocation` prop.

    Properties recieved from the component are (unless in some cases like textInputOnClear):
    - eventName (eg. S.TEXT_INPUT)
    - item (eg. S.USERNAME)
    - location (eg. S.SIGN_IN)

    Other properties such as state and errorType as specific to each event
    and are therefore either defined here OR sent by the component when the event is triggered.
*/

const shared = setup({
    textInputOnFocus: (tm) => {
        return [
            tm.eventName,
            {
                item: tm.item,
                location: tm.location,
                sublocation: TmHelper.currentRoute,
                state: S.IN_FOCUS
            }
        ];
    },

    // Used to send errors when input is blurred
    textInputOnBlur: (tm, errorMsg) => {
        if (!errorMsg) return null; // Do not send error event if there is no error message
        if (errorMsg === 'error_usernameNotAvailable') return null; // Do not track this error here
        return [
            tm.eventName,
            {
                item: tm.item,
                location: tm.location,
                sublocation: TmHelper.currentRoute,
                state: S.ERROR,
                errorType: errorMessage(errorMsg)
            }
        ];
    },

    textInputOnError: (tm, errorMsg) => {
        if (errorMsg !== 'error_usernameNotAvailable' && errorMsg !== 'error_wrongAK') return null;
        return [
            tm.eventName,
            {
                item: tm.item,
                location: tm.location,
                sublocation: TmHelper.currentRoute,
                state: S.ERROR,
                errorType: errorMessage(errorMsg)
            }
        ];
    },

    textInputOnClear: (tm) => {
        return [
            S.CLEAR_TEXT,
            {
                item: tm.item,
                location: tm.location,
                sublocation: TmHelper.currentRoute
            }
        ];
    },

    textInputOnMaxChars: (tm) => {
        return [
            tm.eventName,
            {
                item: tm.item,
                location: tm.location,
                sublocation: TmHelper.currentRoute,
                state: S.MAX_CHARACTERS
            }
        ];
    }
});

module.exports = shared;

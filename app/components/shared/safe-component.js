import React, { Component } from 'react';
/* eslint-disable */
import { Text } from 'react-native';

// TODO: implement @observer in ancestors
export default class SafeComponent extends Component {
    renderThrow() {
        throw new Error('must override SafeComponent: renderThrow');
    }

    errorText(err) {
        let t = 'error rendering component\n';
        try {
            t += `${this.constructor.name}\n`;
        } catch (e) {
            t += `error getting object name\n`;
        }
        try {
            if (__DEV__) console.error(err);
            t += JSON.stringify(err);
        } catch (e) {
            t += `error getting exception text\n`;
        }
        return <Text>{t}</Text>;
    }

    render() {
        try {
            return this.renderThrow();
        } catch (e) {
            return this.errorText(e);
        }
    }
}

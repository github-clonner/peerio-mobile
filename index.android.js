/**
 * @flow
 */

import React from 'react';
import {
    AppRegistry
} from 'react-native';
import './shim';
import App from './app/components/App';

const nicebear = () => (
    <App />
);

AppRegistry.registerComponent('peeriomobile', () => nicebear);

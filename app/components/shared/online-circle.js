import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';

const circleDiameter = 6;

const circleStyle = {
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter / 2,
    margin: 4
};

const circleOnline = {
    backgroundColor: '#7ed321'
};

const circleOffline = {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, .54)',
    backgroundColor: 'transparent'
};

@observer
export default class OnlineCircle extends SafeComponent {
    renderThrow() {
        if (!this.props.visible) return null;
        return (
            <View style={[circleStyle, this.props.online ? circleOnline : circleOffline]} />
        );
    }
}

OnlineCircle.propTypes = {
    visible: React.PropTypes.bool,
    online: React.PropTypes.bool
};

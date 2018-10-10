import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Animated, Easing } from 'react-native';
import { observable, reaction, when } from 'mobx';
import SafeComponent from '../shared/safe-component';

@observer
export default class Swiper extends SafeComponent {
    @observable width = 0;

    constructor(props) {
        super(props);
        this.x = 0;
        this.drag = { x: 0, y: 0 };
        this.state = props.state;
        this.animatedX = this.props.animated ? this.state[this.props.animated] : new Animated.Value(0);

        when(() => this.width, () => {
            this.animatedX.setValue(this.visible ? 0 : this.shift);
        });

        reaction(() => this.width && this.visible, () => {
            this.visible ? this.show() : this.hide();
        }, {fireImmediately: true});
    }

    get visible() {
        return this.props.visible && this.state && this.state[this.props.visible];
    }

    get shift() {
        // 100 is to prevent strange bug with not hiding the swiper completely off screen
        const w = this.props.shift || (this.width);
        return (this.props.rightToLeft ? -1 : 1) * w;
    }

    layout(e) {
        this.width = e.nativeEvent.layout.width;
        if (this.props.width) {
            this.state[this.props.width].setValue(this.width);
        }
    }

    animate(toValue, fast, cb) {
        Animated.timing(this.animatedX, { toValue, duration: fast ? 0 : 200, easing: Easing.bezier(0.4, 0.0, 1, 1) }).start(cb);
    }

    show() {
        this.x = 0;
        this.animate(0);
    }

    hide() {
        this.x = this.shift;
        this.animate(this.shift);
    }

    setVisible(value) {
        this.state && (this.state[this.props.visible] = value);
    }

    setPosition(e) {
        let { x, y } = this;
        const tx = e.nativeEvent.pageX - this.drag.x;
        const ty = e.nativeEvent.pageY - this.drag.y;
        x += tx;
        y += ty;
        if ((this.props.rightToLeft && x > 0) || (this.props.leftToRight && x < 0)) {
            return;
            // x = 0;
        }
        if (this.props.leftToRight && x > this.shift) {
            x = this.shift;
        }

        this.animate(x, true);
        this.x = x;
        this.y = y;
        this.drag.x = e.nativeEvent.pageX;
        this.drag.y = e.nativeEvent.pageY;
        // console.log(this.drag);
    }

    resetPosition(/* e */) {
        const x = Math.abs(this.x);
        const shift = Math.abs(this.shift) * (this.props.threshold || 0.1);
        if (x > shift) {
            // console.log('swiper.js: hiding ${this.x}');
            this.hide();
            this.setVisible(false);
            this.props.onSwipeOut && this.props.onSwipeOut();
        } else {
            this.show();
            this.setVisible(true);
            this.props.onSwipeReset && this.props.onSwipeReset();
        }
        this.y = 0;
        this.clearResetTimeout();
        // this.drag = { x: 0, y: 0 };
    }

    _onStartShouldSetResponderCapture(e) {
        this.drag = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
        this.setPosition(e);
        return false;
    }

    clearResetTimeout() {
        if (this.releaseTimeout) {
            clearTimeout(this.releaseTimeout);
            this.releaseTimeout = null;
        }
    }

    setResetTimeout(timeout) {
        this.clearResetTimeout();
        this.releaseTimeout = setTimeout(
            () => this.resetPosition(), timeout !== undefined ? timeout : 1000);
    }

    _onMoveShouldSetResponderCapture(e) {
        if (!this.visible) {
            return false;
        }
        this.setPosition(e);
        if (Math.abs(this.x) > 30) {
            // we grabbed the responder, no need to be gentle anymore
            console.log('swiper.js: captured responder');
            this.clearResetTimeout();
            return true;
        }
        // so that if somebody dragged a bit and pressed a button, it will move back
        this.setResetTimeout();
        return false;
    }

    _onStartShouldSetResponder(e) {
        this.drag = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY
        };
        this.setPosition(e);
        return true;
    }

    renderThrow() {
        const containerStyle = this.props.style || {};
        let t = [];
        if (this.animatedX) {
            t = [{ translateX: this.animatedX }];
        }
        const s = { transform: t, opacity: this.width ? 1 : 0 };
        const handlers = {
            onLayout: (e) => this.layout(e),
            onResponderMove: (e) => this.setPosition(e),
            onResponderReject: () => this.setResetTimeout(100),
            onResponderRelease: () => this.resetPosition(),
            onStartShouldSetResponder: (e) => this._onStartShouldSetResponder(e),
            onResponderTerminate: () => this.resetPosition(),
            onMoveShouldSetResponderCapture: (e) => this._onMoveShouldSetResponderCapture(e),
            onStartShouldSetResponderCapture: (e) => this._onStartShouldSetResponderCapture(e)
        };

        return (
            <Animated.View
                {...handlers}
                style={[containerStyle, s]}>
                {this.props.children}
            </Animated.View>
        );
    }
}

Swiper.propTypes = {
    children: PropTypes.any.isRequired,
    style: PropTypes.any,
    // {observable({})} observable state
    state: PropTypes.any,
    // {Animated.Value} property in state which corresponds to swiper width
    width: PropTypes.string,
    // {Animated.Value} property in state which corresponds to swiper animation X
    animated: PropTypes.string,
    // {boolean} property in state which corresponds to swiper state
    visible: PropTypes.string.isRequired,
    // swipe right to left
    rightToLeft: PropTypes.bool,
    // or left to right
    leftToRight: PropTypes.bool,
    // expected swiper shift (if not present, will be width + extra
    shift: PropTypes.any,
    threshold: PropTypes.any,
    // when swipe action is finished successfully
    onSwipeOut: PropTypes.func,
    // when swipe action is reset mid-swipe
    onSwipeReset: PropTypes.func
};

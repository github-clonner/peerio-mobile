import { action, observable, computed } from 'mobx';
// import { User } from '../../lib/icebear';
import _ from 'lodash';

// const notSeen = (id) => !User.current.beacons.get(id);

class BeaconState {
    // constructor() {
    //     this.setDelay();
    // }

    // @observable getNextBeacon;
    // setDelay() {
    //     this.getNextBeacon = () => null;
    //     setTimeout(() => {
    //         this.getNextBeacon = () => this.activeBeacon;
    //     }, 3000);
    // }

    @observable.shallow beacons = [];

    @computed get activeBeacon() {
        // uncomment not seen later on
        const beaconToShow = _.sortBy(this.beacons, [c => c.order])
            .find(x => x.condition() /* && notSeen(x.id) */);
        return beaconToShow || null;
    }

    requestBeacon(beacon) {
        if (!beacon) return;
        this.beacons.unshift(beacon);
    }

    @action.bound
    removeBeacon(idToRemove) {
        // this.setDelay();
        if (!idToRemove) return;
        this.beacons = this.beacons.filter(b => b.id !== idToRemove);
    }
}

const beaconState = new BeaconState();

// TODO: remove before merging
global.beaconState = beaconState;

export default beaconState;

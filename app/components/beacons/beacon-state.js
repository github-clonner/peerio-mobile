import { action, observable, computed } from 'mobx';
// import { User } from '../../lib/icebear';

// const notSeen = (id) => !User.current.beacons.get(id);

class BeaconState {
    @observable.shallow beacons = [];

    @computed get activeBeacon() {
        // uncomment not seen later on
        const beaconToShow = this.beacons.find(x => x.condition() /* && notSeen(x.id) */);
        return beaconToShow || null;
    }

    requestBeacon(beacon) {
        if (!beacon) return;
        this.beacons.unshift(beacon);
    }

    @action.bound
    removeBeacon(idToRemove) {
        if (!idToRemove) return;
        this.beacons = this.beacons.filter(b => b.id !== idToRemove);
    }
}

const beaconState = new BeaconState();

// TODO: remove before merging
global.beaconState = beaconState;

export default beaconState;

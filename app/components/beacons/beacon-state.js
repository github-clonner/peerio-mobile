import { action, observable, computed } from 'mobx';
// import { User } from '../../lib/icebear';
import _ from 'lodash';

// const notSeen = (id) => !User.current.beacons.get(id);

class BeaconState {
    @observable.shallow skippedFlows = [];
    @observable beacons = [];

    @computed get activeBeacon() {
        // uncomment not seen later on
        const beaconToShow = _.chain(this.beacons)
            // .filter(b => notSeen(b.id))
            .filter(b => !this.skippedFlows.includes(b.flow))
            .sortBy(b => b.priority)
            .first(x => x.condition())
            .value();
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

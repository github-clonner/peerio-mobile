import { action, observable, computed } from 'mobx';
import { User } from '../../lib/icebear';

const notSeen = (id) => !User.current.beacons.get(id);

class BeaconState {
    @observable.shallow beacons = [];

    @computed get activeBeacon() {
        const beaconToShow = this.beacons.find(x => x.condition() && notSeen(x.id));
        return beaconToShow && beaconToShow.component;
    }

    requestBeacons(beacon) {
        this.beacons.unshift(beacon);
    }

    @action.bound
    removeBeacon(id) {
        this.beacons = this.beacons.filter(beacon => beacon.id !== id);
    }
}

const beaconState = new BeaconState();

export default beaconState;

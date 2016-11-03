import { AsyncStorage } from 'react-native';
import { setTinyDbEngine, db } from '../lib/icebear';

const engine = {
    getValue(name) {
        return AsyncStorage.getItem(name).then(JSON.parse);
    },

    setValue(name, value) {
        return AsyncStorage.setItem(name, JSON.stringify(value));
    }
};

class LocalDb {
    constructor(prefix) {
        this._prefix = prefix || '';
        this.n = this.n.bind(this);
        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
    }

    n(name) {
        return `${this._prefix}::${name}`;
    }

    get(key) {
        return engine.getValue(this.n(key));
    }

    set(key, value) {
        return engine.setValue(this.n(key), value);
    }
}

setTinyDbEngine(engine);

db.open = (name) => {
    return new LocalDb(name);
};

db.openUserDb = (name) => {
    db.user = db.open(name);
    return db.user;
};

db.system = db.open('system');

export default db;

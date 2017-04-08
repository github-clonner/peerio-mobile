import React from 'react';
import { observable, when } from 'mobx';
import Router from './router';
import ComposeMessage from '../messaging/compose-message';
import SelectFiles from '../files/select-files';
import FileShare from '../files/file-share';
import ContactView from '../contacts/contact-view';
import PinModalCreate from '../controls/pin-modal-create';
import routes from './routes';

class RouterModal extends Router {
    // TODO: get rid of it
    @observable modalControl = null;

    constructor() {
        super();
        routes.modal = this;
        this.add('compose', ComposeMessage);
        this.add('shareFileTo', FileShare);
        this.add('selectFiles', SelectFiles);
        this.add('contactView', ContactView);
        this.add('createPin', PinModalCreate);
    }

    add(route, component) {
        this[route] = super.add(route, component).transition;
    }

    waitFor() {
        return new Promise(resolve => when(() => !this.route && !this.modalControl, resolve));
    }

    discard() {
        this.route = null;
    }

    get modal() {
        return this.current ? React.createElement(this.current.component) : null;
    }
}

export default new RouterModal();

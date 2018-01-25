const Page = require('../page');

class ChatPage extends Page {
    get textInput() {
        return this.getWhenVisible(`~textInputMessage`);
    }

    get buttonSendMessage() {
        return this.getWhenVisible('~buttonSendMessage');
    }

    get buttonExitChat() {
        return this.getWhenVisible('~buttonChatBack');
    }
}

module.exports = ChatPage;

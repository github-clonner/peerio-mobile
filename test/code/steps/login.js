const { existingUsers } = require('../helpers/userHelper');

const { Given, When, Then } = require('cucumber');

When('I choose the create account option', function() {
    return this.selectCreateAccount();
});

When('I input my personal info', async function() {
    await this.typePersonalInfo();
});

Then('I am presented with my passcode', async function() {
    await this.savePasscode();
});

Then('I confirm signup', async function() {
    await this.acceptTerms();
});

Then('I am taken to the Login Start screen', async function() {
    await this.startPage.loginButton;
});

Then('I am taken to the home tab', function() {
    return this.seeWelcomeScreen();
});

// Scenario: Autologin
Given('I have signed up', async function() {
    await this.createNewAccount();
});

Given('I have quickly signed up', async function() {
    await this.callQuickSignup();
});

Given('I close Peerio', async function() {
    await this.app.closeApp();
});

When('I open Peerio', async function() {
    await this.app.launch();
});

Given(/(?:I|they) sign out/, async function() {
    await this.logout();
});

When('I sign in', async function() {
    await this.loginExistingAccountWithout2FA(this.username, this.passphrase);
});

When('I sign in with 2fa', async function() {
    await this.loginExistingAccountWith2FA(this.username, this.passphrase);
});

When('I log in as {word} user', async function(string) {
    if (string === 'recent') {
        return this.loginExistingAccountWithout2FA(this.username, this.passphrase);
    }

    if (string === 'helper') {
        return this.loginExistingAccountWithout2FA(this.helperUsername, this.helperPassphrase);
    }

    if (string === 'new') {
        return this.callQuickSignup();
    }

    const credentials = existingUsers[string];
    return this.loginExistingAccountWithout2FA(credentials.name, credentials.passphrase);
});

Then('a helper user signs up', async function() {
    await this.createHelperAccount();
});

Then('the helper user logs in', async function() {
    await this.loginExistingAccountWithout2FA(this.helperUsername, this.helperPassphrase);
});

// this.invitationEmail needs to be set by a previous step definition
Then('Invited user signs up', async function() {
    if (!this.invitationEmail)
        throw new Error('this.invitationEmail needs to be set by a previous step definition');
    await this.createHelperAccount({ email: this.invitationEmail });
});

// this.email needs to be set by a previous step definition
Then('User confirms their email', async function() {
    await this.listener.request('testConfirmEmail()');
});

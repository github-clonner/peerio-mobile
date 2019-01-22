@noCacheReset
Feature: 2 Factor Authentication

    Background:
        Given I have quickly signed up

    Scenario: Enable 2FA for the first time
        Given I enable 2FA
        And   I enter the correct token
        Then  I close Peerio

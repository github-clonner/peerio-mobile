@noCacheReset
Feature: 2 Factor Authentication

    Background:
        Given I have quickly signed up

    Scenario: Enable 2FA on untrusted device
        Given I enable 2FA on an untrusted device
        And   I sign out
        When  I open Peerio
        And   I sign in with 2fa
        And   I am taken to the home tab
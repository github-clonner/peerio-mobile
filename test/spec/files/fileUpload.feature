Feature: File Upload

    Scenario: User uploads a file to Files succesfully
        When I log in as new user
        Then I upload a file from gallery to Files
        And I can download the last uploaded file from Files

    Scenario: User uploads a file to a Room succesfully
        When I log in as new user
        Then I create a new room
        And I upload a file from gallery to the current Chat
        When I exit the current chat
        Then I can download the last uploaded file from Files

Meteor.publish('chats', function() {
    // Meteor._sleepForMs(2000);

    // only one argument passed so must be chat id
    if( arguments.length === 1 ) {
        var chatId = arguments[0];
        check(chatId, String);
        return Chats.find({_id: chatId});
    }

    // two arguments passed so must be ids of the users involved in the chat
    else if( arguments.length === 2 ) {
        var user1Id = arguments[0],
            user2Id = arguments[1];

        check(user1Id, String);
        check(user2Id, String);

        return Chats.find({$or: [
            {
                user1Id: user1Id,
                user2Id: user2Id,
            },
            {
                user1Id: user2Id,
                user2Id: user1Id,
            }
        ]});
    }
});
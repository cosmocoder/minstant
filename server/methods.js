Meteor.methods({
    createChat: function(user1Id, user2Id) {
        check(user1Id, String);
        check(user2Id, String);

        if( user1Id !== this.userId ) {
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }

        if( !Meteor.users.findOne({_id: user2Id}) ) {
            throw new Meteor.Error("user-not-found", "The user you are trying to chat with does not exist!");
        }

        var writingStatus = {};
        writingStatus[user1Id] = false;
        writingStatus[user2Id] = false;

        return Chats.insert({
            user1Id: user1Id,
            user2Id: user2Id,
            writingStatus: writingStatus
        });
    },

    insertMessage: function(chatId, text) {
        // Meteor._sleepForMs(2000);
        check(chatId, String);

        sanitizedText = UniHTML.purify(text);

        var chat = Chats.findOne({_id: chatId});
            msgs = chat.messages;  // pull the messages property

        if (!msgs) {    // no messages yet, create a new array
            msgs = [];
        }

        // is a good idea to insert data straight from the form
        // (i.e. the user) into the database?? certainly not.
        // push adds the message to the end of the array
        msgs.push({text: sanitizedText, userId: this.userId});

        // put the messages array onto the chat object
        chat.messages = msgs;

        return Chats.update(chatId, chat);
    },

    setWritingStatus: function(chatId, userId, isWriting) {
        check(chatId, String);
        check(userId, String);
        check(isWriting, Boolean);

        if( userId !== this.userId ) {
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }

        var chat = Chats.findOne({_id: chatId});
            status = chat.writingStatus;

        status[userId] = isWriting;
        chat.writingStatus = status;

        return Chats.update(chatId, chat);
    }
});
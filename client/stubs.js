Meteor.methods({
    createChat: function(user1Id, user2Id) {
        if( user1Id !== this.userId ) {
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }

        if( !Meteor.users.findOne({_id: user2Id}) ) {
            throw new Meteor.Error("user-not-found", "The user you are trying to chat with does not exist!");
        }

        return Chats.insert({user1Id: user1Id, user2Id: user2Id});
    },

    insertMessage: function(chatId, text) {
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
    }
});
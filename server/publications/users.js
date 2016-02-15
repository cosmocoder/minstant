Meteor.publish('users', function() {
    // Meteor._sleepForMs(2000);

    if( arguments.length === 1 ) {
        var userId = arguments[0];
        check(userId, String);

        return Meteor.users.find({_id: userId});
    }
    else if( arguments.length === 2) {
        var user1Id = arguments[0],
            user2Id = arguments[1];

        check(user1Id, String);
        check(user2Id, String);

        return Meteor.users.find({_id: {
            $in: [user1Id, user2Id]
        }});
    }
    else {
        return Meteor.users.find();
    }
});
Template.navbar.helpers({
    currentUserData: function() {
        var user = Meteor.user();
        return {
            username: user.profile.username,
            avatar: '/' + user.profile.avatar
        };
    }
});
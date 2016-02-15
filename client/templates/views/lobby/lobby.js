// Subscribe to users collection
Template.lobby_page.onCreated(function() {
    this.subscribe('users');
});


/***** Helpers ****/

Template.available_user_list.helpers({
    users: function() {
        return Meteor.users.find();
    }
});

Template.available_user.helpers({
    getUsername: function(userId) {
        user = Meteor.users.findOne({_id: userId});
        return user.profile.username;
    },

    isMyUser: function(userId) {
        if (userId === Meteor.userId()) {
            return true;
        }
        else {
            return false;
        }
    }
});


/***** Events ****/

Template.available_user.events({
    'click .is-locked': function(e) {
        e.preventDefault();

        var $link = $(e.currentTarget);
        $link.popover({
            title: 'Sign In',
            content: 'Please sign in to start a conversation',
            placement: 'bottom'
        })
        .popover('show');

        setTimeout(function() {
            $link.popover('hide');
        }, 2000);
    }
});
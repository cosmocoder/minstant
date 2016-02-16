// Subscribe to users collection
Template.lobby_page.onCreated(function() {
    this.subscribe('users');
});

// trigger click to show all users
Template.available_user_list.onRendered(function() {
    $('div.filter-users .all').trigger('click');
});


/***** Helpers ****/

Template.available_user_list.helpers({
    users: function() {
        return Meteor.users.find({_id: {$ne: Meteor.userId()}});
    }
});

Template.available_user.helpers({
    getUsername: function(userId) {
        user = Meteor.users.findOne({_id: userId});
        return user.profile.username;
    },

    isUserOnline: function(userId) {
        return Meteor.users.findOne({_id: userId, "status.online": true});
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

Template.available_user_list.events({
    'click .filter-users button': function(e) {
        $button = $(e.target);

        if( $button.hasClass('active') ) {
            return;
        }

        $button.addClass('active').siblings().removeClass('active');

        if( $button.hasClass('all') ) {
            $('div.user-avatar').parent().show();
        }
        else {
            $('div.user-avatar').parent().hide().end().filter('.online').parent().show();
        }
    }
});

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
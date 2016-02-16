/**** Subscriptions ****/

Template.chat_page.onCreated(function() {
    var self = this;

    self.autorun(function() {
        var otherUserId = Router.current().params._id;
        self.subscribe('chats', Meteor.userId(), otherUserId);
        self.subscribe('users', Meteor.userId(), otherUserId);

        if( self.subscriptionsReady() ) {
            // find a chat that has two users that match current user id
            // and the requested user id
            var filter = {$or: [
                {
                    user1Id: Meteor.userId(),
                    user2Id: otherUserId
                },
                {
                    user2Id: Meteor.userId(),
                    user1Id: otherUserId
                }
            ]};

            var chat = Chats.findOne(filter);

            if (!chat) {    // no chat matching the filter - need to insert a new one
                chatId = Meteor.call('createChat', Meteor.userId(), otherUserId);
                // chatId = Chats.insert({user1Id: Meteor.userId(), user2Id: otherUserId});
            }
            else {    // there is a chat going already - use that.
                chatId = chat._id;
            }

            if (chatId) {    // looking good, save the id to the session
                Session.set('chatId', chatId);
            }
        }
    });
});



Template.chat_page.onRendered(function() {
    $(window).on('resize orientationChange', setMessagesHeight).trigger('resize');

    Tracker.afterFlush(messagesScrollToBottom);
});


// set the height of the messages container
function setMessagesHeight() {
    var navBarHeight = $('nav.navbar').outerHeight(true),
        headerHeight = $('div.page-header').outerHeight(true),
        formHeight = $('form.js-send-chat').closest('div.row').outerHeight(true),
        windowHeight = $(window).height(),
        $messages = $('div.messages');console.log(headerHeight);

    $messages.css({height: windowHeight - navBarHeight - headerHeight - formHeight - parseInt($messages.css('marginBottom'), 10)});
}


function messagesScrollToBottom() {
    var $messages = $('div.messages');
    $messages.animate({scrollTop: $messages[0].scrollHeight}, 600);
}


/***** Helpers ****/

Template.chat_page.helpers({
    otherUserData: function() {
        var user = Meteor.users.findOne({_id: Router.current().params._id});

        if(user) {
            Tracker.afterFlush(setMessagesHeight);
            return {
                username: user.profile.username,
                avatar: '/' + user.profile.avatar
            };
        }
        else {
            return '';
        }
    },

    messages: function() {
        if( Session.get('chatId') ) {
            var chat = Chats.findOne({_id: Session.get('chatId')});
            Tracker.afterFlush(messagesScrollToBottom);
            return chat.messages;
        }
        else {
            return null;
        }
    },

    writingMessage: function() {
        if( Session.get('chatId') ) {
            var chat = Chats.findOne({_id: Session.get('chatId')}),
                otherUserId = Router.current().params._id;

            if( chat && chat.writingStatus && chat.writingStatus[otherUserId] ) {
                var otherUsername = Meteor.users.findOne({_id: otherUserId}).profile.username;
                Tracker.afterFlush(messagesScrollToBottom);
                return '<p class="writing-message text-muted">' + otherUsername + ' is writing...</p>';
            }
            else {
                return '';
            }
        }
        else {
            return '';
        }
    }
});

Template.chat_message.helpers({
    isMyUser: function(userId) {
        return userId === Meteor.userId();
    },

    user: function(userId) {
        var username = Meteor.users.findOne({_id: userId}).profile.username;
        return username;
    },

    avatar: function(userId) {
        var avatar = Meteor.users.findOne({_id: userId}).profile.avatar;
        return '/' + avatar;
    }
});



/****** Events ****/

Template.chat_page.events({

    // this event fires when the user sends a message on the chat page
    'submit .js-send-chat': function(event, template) {

        // stop the form from triggering a page reload
        event.preventDefault();

        // see if we can find a chat object in the database
        // to which we'll add the message
        var chat = Chats.findOne({_id: Session.get('chatId')});

        if (chat) {    // ok - we have a chat to use

            // update the chat object in the database.
            // Chats.update(chat._id, chat);
            Meteor.call('insertMessage', chat._id, event.target.chat.value, function(error, result) {
                if( error ) {
                    console.log(error.reason);
                }
                else {
                    messagesScrollToBottom();
                }
            });

            Meteor.call('setWritingStatus', Session.get('chatId'), Meteor.userId(), false);

            // reset the form
            event.target.chat.value = '';
        }
    },

    'keyup textarea': function(e, template) {
        // var $writingMessage = template.$('div.writing-message'),
        //     user = Meteor.user().profile.username;

        // // if( Meteor.userId)

        // $writingMessage.html(user + ' is writing...').show();
        if( e.target.value.length > 0 ) {
            Meteor.call('setWritingStatus', Session.get('chatId'), Meteor.userId(), true);
        }
        else {
            Meteor.call('setWritingStatus', Session.get('chatId'), Meteor.userId(), false);
        }
    },

    'blur textarea': function() {
        Meteor.call('setWritingStatus', Session.get('chatId'), Meteor.userId(), false);
    }
});
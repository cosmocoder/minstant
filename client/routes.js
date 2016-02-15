// set up the main template the the router will use to build pages
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});


// specify the top level route, the page users see when they arrive at the site
Router.route('/', function() {
    this.render('navbar', {to: 'header'});
    this.render('lobby_page', {to:'main'});
});


// specify a route that allows the current user to chat to another users
Router.route('/chat/:_id', function() {
    // don't navigate to one's own chat page
    if( this.params._id === Meteor.userId() ) {
        Router.go('/');
    }

    // don't allow access if the visitor is not logged in
    if( !Meteor.userId() ) {
        Router.go('/');
    }

    this.render('navbar', {to: 'header'});
    this.render('chat_page', {to: 'main'});
});
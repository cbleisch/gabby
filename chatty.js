Messages = new Mongo.Collection('messages');

if (Meteor.isClient) {
  Meteor.subscribe('messages');
  Meteor.subscribe('userStatus');

  Template.chatroom.helpers({
    messages: function() {
      return Messages.find({}, {sort: {createdAt: 1}});
    }
  });
  
  Template.mainSideWithChat.helpers({
    usersOnlineCount:function(){
      //event a count of users online too.
      return Meteor.users.find({ "status.online": true }).count();
    }
  });

  

  Template.mainSideWithChat.usersOnline = function() {
    return Meteor.users.find(
      { "status.online": true }
      // { fields: {loginTime} }
    );
  };

  Template.message.helpers({
    formatDate: function(dateVar) {
      return moment(dateVar).format('MM/DD/YYYY h:MM:ss a');
    }
  });

  Template.chatroom.events({
    "submit .new-message": function(event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.text.value.trim();

      // Insert a task into the collection
      if(text.length > 0 && text.length < 500) {
        Meteor.call("addMessage", text);
      }
      // else {
       // message length error here 
      // }

      // Clear form
      event.target.text.value = "";
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("messages", function() {
      // return Messages.find({
      //   $or: [
      //     // { createdAt: {$gt: Meteor.user().loginTime)} }
      //     // { createdAt: {$gt: Date.create("now")} }
      //   ]
      // });
      return Messages.find();
  });

  Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true });
  });
}

Meteor.methods({
  addMessage: function(text) {
    // Make sure the user is logged in before inserting a task
    if(! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Messages.insert({
        text: text,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
    });
  }
});
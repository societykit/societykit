//////////////////////////// ELEMENT: CHAT ////////////////////////////
/*
  Chat
  
*/
Chat = {};

//////////////////////////// MODEL ////////////////////////////
/*

*/
// * * * DATABASE COLLECTION
Messages = new Mongo.Collection("messages");

// * * * INITIALIZE
/*Meteor.startup(function(){
});
*/

Meteor.subscribe("messages");

//////////////////////////// VIEW ////////////////////////////
// * * * TEMPLATE
Chat.template = Template.chat;

Template.chatMessages.helpers({
  messages: function () {
    return Messages.find({topicId: this.topicId}, {sort: {createdAt: 1}});
  }
});



// * * * EVENTS

Template.chatWriteMessage.events({
  
  'submit .chatAddMessage' : function (event, template) {
    event.preventDefault();
    Messages.insert({
      createdBy: Meteor.userId(),
      createdAt: new Date(),
      username: template.find(".username").value,
      content: template.find(".content").value,
      topicId: this.topicId
    });
  }
});

//////////////////////////// CONTROLLER ////////////////////////////
/*
Chat.computation = Tracker.autorun(function() {
  
  // * * * OWN VARIABLES
  Object.defineProperties(Chat, {
  });
});
*/

// * * * INTERFACE FOR OTHER ELEMENTS
//Chat.fn = function () {...}
  
  

// * * * CONNECT TO OTHER ELEMENTS
/*Meteor.startup(function(){
});
*/

//////////////////////////// END OF FILE ////////////////////////////

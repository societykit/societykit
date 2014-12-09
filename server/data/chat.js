Messages = new Mongo.Collection("messages");

Meteor.publish("messages", function() {
  return Messages.find();
});


Messages.allow({
//// INSERT
insert: function() {
  return true;
},
  
//// UPDATE
update: function() {
  return true;
},

//// REMOVE
remove: function() {
  return true;
}
});


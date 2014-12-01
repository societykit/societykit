//////////////////////////// ELEMENT: JOINS ////////////////////////////
/*
- An abstract class for handling mongo database joins.
*/
Societies2Users = new Mongo.Collection("societies2users");

Meteor.publish("societies2users", function( parameters ) {
  var cursor = Societies2Users.find();
  return cursor;
});

Societies2Users.allow({
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


//////////////////////////// END OF FILE ////////////////////////////

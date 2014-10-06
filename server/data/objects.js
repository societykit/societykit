//////////////////////////// ELEMENT: OBJECTS (SERVER) /////////////////////////
/*
For saving data about objects.
*/
Objects = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Objects.Data = new Meteor.Collection("objects");

//// INSERT INITIAL DATA
//Meteor.startup(function () {});

//////////////////////////// VIEW ////////////////////////////
//// SELECT
Meteor.publish("objects", function( parameters ) {
  var cursor = Objects.Data.find();
  console.log("Objects::publish: Parameters: " + EJSON.stringify(parameters) + ". Return: " + EJSON.stringify( cursor.fetch() ) );
  return cursor;
});

Objects.Data.allow({
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

//////////////////////////// CONTROLLER ////////////////////////////
//// INTERFACE FOR OTHER ELEMENTS
//Objects.fn = function () {}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){ //Txtcmd.set([]); });

//////////////////////////// END OF FILE ////////////////////////////
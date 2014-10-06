//////////////////////////// ELEMENT: PERSONS (SERVER) /////////////////////////
/*
For saving data about persons.
*/
Persons = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Persons.Data = new Meteor.Collection("persons");

//// INSERT INITIAL DATA
//Meteor.startup(function () {});

//////////////////////////// VIEW ////////////////////////////
//// SELECT
Meteor.publish("persons", function( parameters ) {
  var cursor = Persons.Data.find();
  console.log("Persons::publish: Parameters: " + EJSON.stringify(parameters) + ". Return: " + EJSON.stringify( cursor.fetch() ) );
  return cursor;
});

Persons.Data.allow({
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
//Persons.fn = function () {}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){ //Txtcmd.set([]); });

//////////////////////////// END OF FILE ////////////////////////////
//////////////////////////// ELEMENT: ITEMS (SERVER) /////////////////////////
/*
An abstract class for handling any kinds of "items".
*/
Items = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Items.Data = new Meteor.Collection("items");

//// INSERT INITIAL DATA
//Meteor.startup(function () {});

//////////////////////////// VIEW ////////////////////////////
//// SELECT
Meteor.publish("items", function( parameters ) {
  var cursor = Items.Data.find();
  console.log("Items::publish Parameters: " + EJSON.stringify(parameters) + ". Return: " + EJSON.stringify( cursor.fetch() ) );
  return cursor;
});

Items.Data.allow({
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
//Items.fn = function () {}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){ //Txtcmd.set([]); });

//////////////////////////// END OF FILE ////////////////////////////
/*

*/
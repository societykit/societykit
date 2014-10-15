//////////////////////////// ELEMENT: SOURCES (SERVER) /////////////////////////
/*
For saving data about sources.
*/
Sources = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Sources.Data = new Meteor.Collection("sources");

//// INSERT INITIAL DATA
//Meteor.startup(function () {});

//////////////////////////// VIEW ////////////////////////////
//// SELECT
Meteor.publish("sources", function( parameters ) {
  var cursor = Sources.Data.find();
  console.log("Sources::publish: Parameters: " + EJSON.stringify(parameters) + ". Return: " + EJSON.stringify( cursor.fetch() ) );
  return cursor;
});

Sources.Data.allow({
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
//Sources.fn = function () {}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){ //Txtcmd.set([]); });

//////////////////////////// END OF FILE ////////////////////////////
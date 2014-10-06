//////////////////////////// ELEMENT: COMPANIES (SERVER) /////////////////////////
/*
For saving data about companies.
*/
Companies = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Companies.Data = new Meteor.Collection("companies");

//// INSERT INITIAL DATA
//Meteor.startup(function () {});

//////////////////////////// VIEW ////////////////////////////
//// SELECT
Meteor.publish("companies", function( parameters ) {
  var cursor = Companies.Data.find();
  console.log("Companies::publish: Parameters: " + EJSON.stringify(parameters) + ". Return: " + EJSON.stringify( cursor.fetch() ) );
  return cursor;
});

Companies.Data.allow({
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
//Companies.fn = function () {}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){ //Txtcmd.set([]); });

//////////////////////////// END OF FILE ////////////////////////////
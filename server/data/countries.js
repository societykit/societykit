//////////////////////////// ELEMENT: COUNTRIES (SERVER) /////////////////////////
/*
For saving data about countries.
*/
Countries = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Countries.Data = new Meteor.Collection("countries");

//// INSERT INITIAL DATA
//Meteor.startup(function () {});

//////////////////////////// VIEW ////////////////////////////
//// SELECT
Meteor.publish("countries", function( parameters ) {
  var cursor = Countries.Data.find();
  console.log("Countries::publish: Parameters: " + EJSON.stringify(parameters) + ". Return: " + EJSON.stringify( cursor.fetch() ) );
  return cursor;
});

Countries.Data.allow({
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
//Countries.fn = function () {}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){ //Txtcmd.set([]); });

//////////////////////////// END OF FILE ////////////////////////////
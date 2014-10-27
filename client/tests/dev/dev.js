//////////////////////////// ELEMENT: DEV ////////////////////////////
/*
The Dev object can be used for developing purposes such as logging
or performance testing.
*/
Dev = {};

//////////////////////////// MODEL ////////////////////////////
//// DATABASE COLLECTION
//Dev.Debugs = new Meteor.Collection("devDebugs");
//Meteor.subscribe("devDebugs");

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
/*
//// TEMPLATE
Dev.template = Template.dev;
Dev.template.helpers({});
Dev.template.fn = function () {}
Dev.template.debug = "";
//// EVENTS
Dev.template.events({});
*/
//////////////////////////// CONTROLLER ////////////////////////////
/*Dev.computation = Tracker.autorun(function() {
  //// OWN VARIABLES
  Object.defineProperties(Dev, {
  });
});
*/

//// INTERFACE FOR OTHER ELEMENTS
/*
Function: DEV::DEBUG
Description: Prints a debug message to places where it is needed.
A more light-weight than using this function is to just type:
console.log("message here")
*/
Dev.debug = function (debug) {
  // TODO Edit/format the message nicely.
  //this.template.debug = debug;
}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){});

//////////////////////////// END OF FILE ////////////////////////////
//////////////////////////// ELEMENT: DEV ////////////////////////////
// * * * CREATE OBJECT
Dev = {};
console.log("Dev::constructor   Object created.");

//////////////////////////// MODEL ////////////////////////////
/*

  The parent of all views: HTML document.
  
  
*/

// * * * DATABASE COLLECTION
Dev.Debugs = new Meteor.Collection("devDebugs");
Meteor.subscribe("devDebugs");

// Modern way?
/*Object.defineProperty(Dev, "Devs", {
  value: new Meteor.Collection("devs")
});*/




// * * * INITIALIZE
Meteor.startup(function(){
  
});












//////////////////////////// VIEW ////////////////////////////

// * * * TEMPLATE
Dev.template = Template.dev;

Dev.template.helpers({});


Dev.template.fn = function () {
}

Dev.template.debug = "";


// * * * EVENTS
Dev.template.events({});











//////////////////////////// CONTROLLER ////////////////////////////

Dev.computation = Deps.autorun(function() {
  
  
  
  // * * * OWN VARIABLES
  Object.defineProperties(Dev, {
  });
  
  
  
});






// * * * INTERFACE FOR OTHER ELEMENTS

Dev.debug = function (debug) {
  
  // TODO Edit/format the message nicely.
  
  this.template.debug = debug;
}








// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  
});







Object.seal(Dev);

//////////////////////////// END OF FILE ////////////////////////////
/*


*/
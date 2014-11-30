//////////////////////////// ELEMENT: HEADER ////////////////////////////
/*
  Header of the website
  
*/
Header = {};

//////////////////////////// MODEL ////////////////////////////
/*

*/
// * * * DATABASE COLLECTION

// * * * INITIALIZE
/*Meteor.startup(function(){
});
*/

//////////////////////////// VIEW ////////////////////////////
// * * * TEMPLATE
Header.template = Template.header;
Header.template.helpers({
});

// * * * EVENTS
Header.template.events({
  
  // Click the website logo -> go to home page.
  'click #logo': function () {
    Page.setPage("home");
  }
});


//////////////////////////// CONTROLLER ////////////////////////////
/*
Header.computation = Tracker.autorun(function() {
  
  // * * * OWN VARIABLES
  Object.defineProperties(Header, {
  });
});
*/

// * * * INTERFACE FOR OTHER ELEMENTS
//Header.fn = function () {...}


// * * * CONNECT TO OTHER ELEMENTS
/*Meteor.startup(function(){
});
*/

//////////////////////////// END OF FILE ////////////////////////////
/*

*/ 

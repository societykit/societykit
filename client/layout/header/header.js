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
  homeIfNeeded: function () {
    if( Page.getPage() === "home" ) {
      return " headerHome";
    }
    else {
      return "";
    }
  }
});

// * * * EVENTS
//Header.template.events({});


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

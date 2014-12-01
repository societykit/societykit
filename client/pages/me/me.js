//////////////////////////// ELEMENT: PAGEME ////////////////////////////
/*

*/
PageMe = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE
PageMe.template = Template.pageMe;

PageMe.template.helpers({
  
  getJoinedSocieties : function() {
    return Societies2Users.find( { user: Meteor.userId() });
  }
  
});


Template.pageMeJoinedSocieties.helpers({
 
  getSociety : function() {
    return Societies.db.findOne( { _id: this.society } );
  }
  
});

//// EVENTS
//PageMe.template.events({});

//////////////////////////// CONTROLLER ////////////////////////////
/*PageMe.computation = Tracker.autorun(function() {
  //// OWN VARIABLES
  Object.defineProperties(PageMe, {
  });
});*/

//// INTERFACE FOR OTHER ELEMENTS
//PageMe.fn = function () {...}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){});

//////////////////////////// END OF FILE ////////////////////////////

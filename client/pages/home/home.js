//////////////////////////// ELEMENT: PAGEHOME ////////////////////////////
/*
PageHome is the front page of the web application.
*/
PageHome = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE
PageHome.template = Template.pageHome;
//PageHome.template.helpers({});

//// EVENTS
PageHome.template.events({
  'click .homeSociety': function () {
    Page.setPage("data");
  },
  'click #homeAbout': function () {
    Page.setPage("about");
  }
});

//////////////////////////// CONTROLLER ////////////////////////////
/*PageHome.computation = Tracker.autorun(function() {
  //// OWN VARIABLES
  Object.defineProperties(PageHome, {
  });
});*/

//// INTERFACE FOR OTHER ELEMENTS
//PageHome.fn = function () {...}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){});

//////////////////////////// END OF FILE ////////////////////////////
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
  'click #homeSocieties': function () {
    Page.setPage("societies");
  },
  'click #homeData': function () {
    Page.setPage("data");
  },
  'click #homeMe': function () {
    Page.setPage("me");
  },
  'click #homeHowitworks': function () {
    Page.setPage("howitworks");
  },
  'click #homeJoinproject': function () {
    Page.setPage("joinproject");
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
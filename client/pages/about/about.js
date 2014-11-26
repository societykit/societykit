//////////////////////////// ELEMENT: PAGEABOUT ////////////////////////////
/*
PageAbout is the front page of the web application.
*/
PageAbout = {};

Session.setDefault("whichPopup", false);

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE
PageAbout.template = Template.pageAbout;
PageAbout.template.helpers({
  whichPopup: function() {
    return Session.get("whichPopup");
  },
  
});

//// EVENTS
PageAbout.template.events({
  "click #aboutPopupTeamButton": function (){
    Session.set("whichPopup", "aboutPopupTeam");
  }
});

Template.aboutPopupTeam.events({
  "click .popupClose": function (){
    Session.set("whichPopup", false);
    Popup.close("#aboutPopupTeam");
  }
});

//////////////////////////// CONTROLLER ////////////////////////////
/*PageAbout.computation = Tracker.autorun(function() {
  //// OWN VARIABLES
  Object.defineProperties(PageAbout, {
  });
});*/

//// INTERFACE FOR OTHER ELEMENTS
//PageAbout.fn = function () {...}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){});

//////////////////////////// END OF FILE ////////////////////////////

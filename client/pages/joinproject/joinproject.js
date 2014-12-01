//////////////////////////// ELEMENT: PAGEJOINPROJECT ////////////////////////////
/*
PageJoinproject is the front page of the web application.
*/
PageJoinproject = {};

Session.setDefault("whichPopup", false);

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE
PageJoinproject.template = Template.pageJoinproject;

PageJoinproject.template.helpers({
  whichPopup: function() {
    return Session.get("whichPopup");
  },
  
});

//// EVENTS
PageJoinproject.template.events({
  
  "click #joinprojectPopupCitizensButton": function (){
    Session.set("whichPopup", "joinprojectPopupCitizens");
  },
  
  "click #joinprojectPopupDiagramButton": function (){
    Session.set("whichPopup", "joinprojectPopupDiagram");
  },
  
  "click #joinprojectPopupExtrasButton": function (){
    Session.set("whichPopup", "joinprojectPopupExtras");
  },
  
  "click .popupClose": function (){
    Session.set("whichPopup", false);
    Popup.close("#joinprojectPopupCitizens");
    Popup.close("#joinprojectPopupDiagram");
    Popup.close("#joinprojectPopupExtras");
  }
});

//////////////////////////// CONTROLLER ////////////////////////////
/*PageJoinproject.computation = Tracker.autorun(function() {
  //// OWN VARIABLES
  Object.defineProperties(PageJoinproject, {
  });
});*/

//// INTERFACE FOR OTHER ELEMENTS
//PageJoinproject.fn = function () {...}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){});

//////////////////////////// END OF FILE ////////////////////////////

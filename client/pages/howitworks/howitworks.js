//////////////////////////// ELEMENT: PAGEHOWITWORKS ////////////////////////////
/*
PageHowitworks is the front page of the web application.
*/
PageHowitworks = {};

Session.setDefault("whichPopup", false);

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE
PageHowitworks.template = Template.pageHowitworks;

PageHowitworks.template.helpers({
  whichPopup: function() {
    return Session.get("whichPopup");
  },
  
});

//// EVENTS
PageHowitworks.template.events({
  
  "click #howitworksPopupCitizensButton": function (){
    Session.set("whichPopup", "howitworksPopupCitizens");
  },
  
  "click #howitworksPopupDiagramButton": function (){
    Session.set("whichPopup", "howitworksPopupDiagram");
  },
  
  "click #howitworksPopupExtrasButton": function (){
    Session.set("whichPopup", "howitworksPopupExtras");
  },
  
  "click .popupClose": function (){
    Session.set("whichPopup", false);
    Popup.close("#howitworksPopupCitizens");
    Popup.close("#howitworksPopupDiagram");
    Popup.close("#howitworksPopupExtras");
  }
});

//////////////////////////// CONTROLLER ////////////////////////////
/*PageHowitworks.computation = Tracker.autorun(function() {
  //// OWN VARIABLES
  Object.defineProperties(PageHowitworks, {
  });
});*/

//// INTERFACE FOR OTHER ELEMENTS
//PageHowitworks.fn = function () {...}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){});

//////////////////////////// END OF FILE ////////////////////////////

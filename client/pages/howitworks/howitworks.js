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
  
  "click #howitworksPopupNeedsButton": function (){
    Session.set("whichPopup", "howitworksPopupNeeds");
  },
  
  "click #howitworksPopupSocietiesButton": function (){
    Session.set("whichPopup", "howitworksPopupSocieties");
  },
  
  "click #howitworksPopupLawsButton": function (){
    Session.set("whichPopup", "howitworksPopupLaws");
  },
  
  "click #howitworksPopupConditionalCommitmentsButton": function (){
    Session.set("whichPopup", "howitworksPopupConditionalCommitments");
  },
  
  "click #howitworksPopupOrganizationsButton": function (){
    Session.set("whichPopup", "howitworksPopupOrganizations");
  },
  
  "click #howitworksPopupFacebookButton": function (){
    Session.set("whichPopup", "howitworksPopupFacebook");
  },
  
  "click #howitworksPopupDiagramButton": function (){
    Session.set("whichPopup", "howitworksPopupDiagram");
  },
  
  "click #howitworksPopupExtrasButton": function (){
    Session.set("whichPopup", "howitworksPopupExtras");
  },
  
  "click #howitworksPopupSourcesButton": function (){
    Session.set("whichPopup", "howitworksPopupSources");
  },
  
  "click #howitworksPopupIncentivizedButton": function (){
    Session.set("whichPopup", "howitworksPopupIncentivized");
  },
  
  "click #howitworksPopupQuantifyingButton": function (){
    Session.set("whichPopup", "howitworksPopupQuantifying");
  },
  
  "click #howitworksPopupReliabilityButton": function (){
    Session.set("whichPopup", "howitworksPopupReliability");
  },
  
  "click #howitworksPopupDataProcessingButton": function (){
    Session.set("whichPopup", "howitworksPopupDataProcessing");
  },
  
  "click #howitworksPopupMissingDataButton": function (){
    Session.set("whichPopup", "howitworksPopupMissingData");
  },
  
  "click .popupClose": function (){
    Session.set("whichPopup", false);
    Popup.close("#howitworksPopupFacebook");
    Popup.close("#howitworksPopupDiagram");
    Popup.close("#howitworksPopupExtras");
  },
  
  
  'click #howitworksJoinproject': function () {
    Page.setPage("joinproject");
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

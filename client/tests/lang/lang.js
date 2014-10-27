////////////////////////////// ELEMENT: LANG //////////////////////////////
/*
This class enables translating the web application into different languages.
Also, other localizations such as number formats, currencies, color schemes
and icons may be enabled by this class at some point.
*/
Lang = {};

//////////////////////////// MODEL ////////////////////////////
//// DATABASE COLLECTION
//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE
Lang.template = Template.lang;
Lang.template.content = function() {
  return "(lang haettuna db:stä, id=" + this.id + ")";
};
//Lang.template.helpers({});

//// EVENTS
//Lang.template.events({});

//////////////////////////// CONTROLLER ////////////////////////////
/*Lang.computation = Tracker.autorun(function() {
  //// OWN VARIABLES
  Object.defineProperties(Lang, {
  });
});
*/

//// INTERFACE FOR OTHER ELEMENTS
//Lang.fn = function () {}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){});

////////////////////////////// END OF FILE //////////////////////////////
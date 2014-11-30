//////////////////////////// ELEMENT: POPUP ////////////////////////////
/*
  Popup
  
*/
Popup = {};

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
Popup.template = Template.popup;

Popup.template.helpers({
});


// * * * EVENTS
Popup.template.events({
    'click .popup .popupClose': function () {
      // ??? TODO ???
    }
});


//////////////////////////// CONTROLLER ////////////////////////////
/*
Popup.computation = Tracker.autorun(function() {
  
  // * * * OWN VARIABLES
  Object.defineProperties(Popup, {
  });
});
*/

// * * * INTERFACE FOR OTHER ELEMENTS
//Popup.fn = function () {...}

Popup.rendered = function () {
  // TODO ??? what happens when popup is opened
}

Popup.close = function (element) {
  // TODO ??? what happens when popup is closed
}
  
  

// * * * CONNECT TO OTHER ELEMENTS
/*Meteor.startup(function(){
});
*/

//////////////////////////// END OF FILE ////////////////////////////
/*

*/

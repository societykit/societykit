//////////////////////////// ELEMENT: LOGIN ////////////////////////////
/*
  User login and logout
  
*/
Login = {};

//////////////////////////// MODEL ////////////////////////////
/*
*/
// * * * DATABASE COLLECTION
// * * * INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
// * * * TEMPLATE
//Login.template = Template.login;
//Login.template.helpers({});
//Template.login.fn = function () {}

// * * * EVENTS
//Login.template.events({});


//////////////////////////// CONTROLLER ////////////////////////////
/*Login.computation = Tracker.autorun(function() {
  // * * * OWN VARIABLES
  Object.defineProperties(Login, {
  });
});
*/
Accounts.ui.config({
  requestPermissions: {
  },
  requestOfflineToken: {
  },
  passwordSignupFields: 'EMAIL_ONLY'
});

// * * * INTERFACE FOR OTHER ELEMENTS
//Login.fn = function () {...}

// * * * CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){});

//////////////////////////// END OF FILE ////////////////////////////
/*

*/

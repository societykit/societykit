//////////////////////////// ELEMENT: LOGIN ////////////////////////////
// * * * CREATE OBJECT
Login = {};
console.log("Login::constructor   Object created.");

/*
  
  User login and logout


*/


//////////////////////////// MODEL ////////////////////////////
/*


*/

// * * * DATABASE COLLECTION
//Login.login = new Meteor.Collection("loginStructures");
// From login package?

//Meteor.subscribe("loginStructures", function() {
//  console.log( "Login struktuurit, kpl:"+ EJSON.stringify( Login.Structures.find().fetch() ) );
//});


// * * * INITIALIZE
Meteor.startup(function(){
  
  
});







//////////////////////////// VIEW ////////////////////////////

// * * * TEMPLATE
Login.template = Template.login;

Login.template.helpers({});



Template.login.fn = function () {
}
  



// * * * EVENTS
Login.template.events({});







//////////////////////////// CONTROLLER ////////////////////////////

Login.computation = Deps.autorun(function() {
  
  
  // * * * OWN VARIABLES
  Object.defineProperties(Login, {
    
  });
  
  
});



Accounts.ui.config({
  requestPermissions: {
  },
  requestOfflineToken: {
  },
  passwordSignupFields: 'USERNAME_ONLY'
});



// * * * INTERFACE FOR OTHER ELEMENTS

//Login.fn = function () {...}





// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  
  
  
});




//Object.seal(Login);

//////////////////////////// END OF FILE ////////////////////////////
 

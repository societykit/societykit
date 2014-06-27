//////////////////////////// ELEMENT: FORM ////////////////////////////
// * * * CREATE OBJECT
Form = {};
console.log("Form::constructor   Object created.");

//////////////////////////// MODEL ////////////////////////////
/*

  The parent of all views: HTML document.
  
  
*/

// * * * DATABASE COLLECTION
//Form.Forms = new Meteor.Collection("forms");
//Meteor.subscribe("forms");

// Modern way?
/*Object.defineProperty(Form, "Forms", {
  value: new Meteor.Collection("forms")
});*/




// * * * INITIALIZE
Meteor.startup(function(){
  
});




//////////////////////////// VIEW ////////////////////////////

// * * * TEMPLATE







//////////////////////////// CONTROLLER ////////////////////////////

Form.computation = Deps.autorun(function() {
  
  // * * * OWN VARIABLES
  Object.defineProperties(Form, {
  });
  
});




// * * * INTERFACE FOR OTHER ELEMENTS

Form.fn = function () {
  
}




// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  
});






//Object.seal(Form);

//////////////////////////// END OF FILE ////////////////////////////
/*


*/
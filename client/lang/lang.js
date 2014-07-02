//////////////////////////// ELEMENT: LANG ////////////////////////////
// * * * CREATE OBJECT
Lang = {};
console.log("Lang::constructor   Object created.");

//////////////////////////// MODEL ////////////////////////////
/*

  The parent of all views: HTML document.
  
  
*/

// * * * DATABASE COLLECTION
//Lang.Langs = new Meteor.Collection("langs");
//Meteor.subscribe("langs");

// Modern way?
/*Object.defineProperty(Lang, "Langs", {
  value: new Meteor.Collection("langs")
});*/




// * * * INITIALIZE
Meteor.startup(function(){
  
});




//////////////////////////// VIEW ////////////////////////////

// * * * TEMPLATE
Lang.template = Template.lang;


Lang.template.content = function() {
  return "(lang haettuna db:stä, id=" + this.id + ")";
};


Lang.template.helpers({});

Lang.template.editing = function () {
  return SiteEditor.editing;
}


// * * * EVENTS
Lang.template.events({});





//////////////////////////// CONTROLLER ////////////////////////////

Lang.computation = Deps.autorun(function() {
  
  // * * * OWN VARIABLES
  Object.defineProperties(Lang, {
  });
  
});




// * * * INTERFACE FOR OTHER ELEMENTS

Lang.fn = function () {
  
}




// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  
});






//Object.seal(Lang);

//////////////////////////// END OF FILE ////////////////////////////
/*


*/
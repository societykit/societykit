//////////////////////////// ELEMENT: LAYOUT ////////////////////////////
// * * * CREATE OBJECT
Layout = {};
console.log("Layout::constructor   Object created.");
/*
  User layout and logout
  
*/


//////////////////////////// MODEL ////////////////////////////
/*

*/

// * * * DATABASE COLLECTION
//Layout.layout = new Meteor.Collection("layoutStructures");
// From layout package?

//Meteor.subscribe("layoutStructures", function() {
//  console.log( "Layout struktuurit, kpl:"+ EJSON.stringify( Layout.Structures.find().fetch() ) );
//});

// * * * INITIALIZE
Meteor.startup(function(){
});


//////////////////////////// VIEW ////////////////////////////
// * * * TEMPLATE
Layout.template = Template.layout;

Layout.template.helpers({});

Layout.template.editing = function () {
  return SiteEditor.editing;
}

// * * * EVENTS
Layout.template.events({});


//////////////////////////// CONTROLLER ////////////////////////////
Layout.computation = Deps.autorun(function() {
  
  // * * * OWN VARIABLES
  Object.defineProperties(Layout, {
  });
});


// * * * INTERFACE FOR OTHER ELEMENTS
//Layout.fn = function () {...}


// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
});


//Object.seal(Layout);
//////////////////////////// END OF FILE ////////////////////////////
/*

*/
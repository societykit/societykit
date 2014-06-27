//////////////////////////// ELEMENT: MARKET ////////////////////////////
// * * * CREATE OBJECT
Market = {};
console.log("Market::constructor   Object created.");
/*
  User market and logout
  
*/


//////////////////////////// MODEL ////////////////////////////
/*

*/

// * * * DATABASE COLLECTION
//Market.market = new Meteor.Collection("marketStructures");
// From market package?

//Meteor.subscribe("marketStructures", function() {
//  console.log( "Market struktuurit, kpl:"+ EJSON.stringify( Market.Structures.find().fetch() ) );
//});

// * * * INITIALIZE
Meteor.startup(function(){
});


//////////////////////////// VIEW ////////////////////////////
// * * * TEMPLATE
Market.template = Template.market;

Market.template.helpers({});

Market.template.editing = function () {
  return SiteEditor.editing;
}

// * * * EVENTS
Market.template.events({});


//////////////////////////// CONTROLLER ////////////////////////////
Market.computation = Deps.autorun(function() {
  
  // * * * OWN VARIABLES
  Object.defineProperties(Market, {
  });
});


// * * * INTERFACE FOR OTHER ELEMENTS
//Market.fn = function () {...}


// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
});


//Object.seal(Market);
//////////////////////////// END OF FILE ////////////////////////////
/*

*/
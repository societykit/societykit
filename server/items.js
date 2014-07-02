//////////////////////////// SERVER ////////////////////////////
//////////////////////////// ELEMENT: ITEMS ////////////////////////////
// * * * CREATE OBJECT
Items = {};
console.log("Items::constructor   Object created.");



//////////////////////////// MODEL ////////////////////////////

// * * * DATABASE COLLECTION
Items.Data = new Meteor.Collection("items");


// * * * INITIALIZE
Meteor.startup(function () {
  
});




//////////////////////////// VIEW ////////////////////////////


// * * * SELECT
Meteor.publish("items", function( parameters ) {
  var self = Items;
  console.log("Items::publish   Parameters = " + parameters );
  
  var cursor = self.Data.find();
  console.log("Items::publish   Return = " + EJSON.stringify( cursor.fetch() ) );
  return cursor;
});

Items.Data.allow({
// * * * INSERT
insert: function() {
  return true;
},
  
// * * * UPDATE
update: function() {
  return true;
},

// * * * REMOVE
remove: function() {
  return true;
}
});




//////////////////////////// CONTROLLER ////////////////////////////
// * * * INTERFACE FOR OTHER ELEMENTS
Items.fn = function () {
  
}

// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  var self = Items;
  //Txtcmd.set([]);
});




//////////////////////////// END OF FILE ////////////////////////////
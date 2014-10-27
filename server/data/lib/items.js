//////////////////////////// ELEMENT: ITEMS (SERVER) /////////////////////////
/*
An abstract class for handling any kinds of "items".
*/
Items = {};
Items.children = {};
Items.inherit = function (className, initialData) {
  var obj = {};
  if( typeof className !== "string" ) {
    return false;
  }
  obj.className = className;

  // Create new database collection
  obj.db = new Meteor.Collection( className );

  // Insert the initial data if given properly
  if( typeof initialData === "array" || typeof initialData === "object" ) {

    console.log( "Create data...: " + EJSON.stringify( initialData ) );
    
    // Remove old data
    obj.db.remove({});

    // Go through all items in the initial data set
    for( var i = 0; i < initialData.length; i++ ) {

      // Insert the data item to the database of the inheriting class
      obj.db.insert( initialData[i] );
    }
  }
  
  // Now we're ready to publish the data
  Meteor.publish(className, function( className ) {
    var cursor = Items.children[ className ].db.find();
    console.log(className + "::publish() = " + EJSON.stringify( cursor.fetch() ) );
    return cursor;
  });

  // Set permissions
  obj.db.allow({
    insert: function() {
      return true;
    },

    update: function() {
      return true;
    },

    remove: function() {
      return true;
    }
  });

  Items.children[className] = obj;
  return obj;
}



//////////////////////////// CONTROLLER ////////////////////////////
//// INTERFACE FOR OTHER ELEMENTS

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){ //Txtcmd.set([]); });

//////////////////////////// END OF FILE ////////////////////////////
//////////////////////////// SERVER ////////////////////////////
//////////////////////////// ELEMENT: TXTCMD ////////////////////////////
// * * * CREATE OBJECT
Txtcmd = {};
console.log("Txtcmd::constructor   Object created.");



//////////////////////////// MODEL ////////////////////////////
/*
  _id               object id
  texts          texts
  action
*/
// * * * CREATE DB COLLECTION
Txtcmd.Commands = new Meteor.Collection("txtcmdCommands"); // TODO Use a database for user-created personal text commands (?)

// * * * INITIALIZE
(function(){
  var self = Txtcmd;
  self.Commands.remove({}); // Empty commands from before
})();



//////////////////////////// VIEW ////////////////////////////
// * * * SELECT
Meteor.publish("txtcmdCommands", function() {
  return Txtcmd.Commands.find();
});
Txtcmd.Commands.allow({
  
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

/*
Function: An element can define textual commands that it wants to provide for the user
Parameters:
  commands: array<command>
  
...where:
  command: {
    texts
    action
  }
  texts: array<text>
  text: string (user input)
  action: string (javascript code)
  
Used by:
  Navi
  Page
  Client::Txtcmd (?)
  
Uses:
  ?

Version history:
  01.12.13 Panu
    Went through and cleaned.
    All commands must now have properties "texts" and "action".
    
*/
Txtcmd.set = function (commands) {
  console.log( "Txtcmd::set   commands=" + EJSON.stringify(commands) );
  
  var self = this;
  
  // If only single command was given, put it in an array
  if( !Array.isArray(commands) && typeof commands === "object" ) {
    commands = [ commands ];
  }
  // Is the type still not an array?
  if( ! Array.isArray( commands ) ) {
    // Then we can't proceed with this parameter
    console.log("Txtcmd::set   Error: not an array nor a single object. Return error value FALSE.");
    return false;
  }
  
  // Handle all commands in the array
  for( var i = 0; i < commands.length; i++ ) {
    
    // Only one text given? Put it in an array.
    if( typeof commands[i].texts === "string" ) {
      commands[i].texts = [ commands[i].texts ];
    }
    
    // Still not an array as the texts?
    if( !Array.isArray( commands[i].texts ) ) {
      console.log( "Txtcmd::set   Not an array of texts: "+EJSON.stringify(commands[i].texts) + ", skip this command." );
      continue;
    }
    
    // Check that all texts are strings
    for( var iText = 0; iText < commands[i].texts.length; iText++ ) {
      if( typeof commands[i].texts[iText] !== "string" ) {
        console.log( "Txtcmd::set   This text is not a string: " + EJSON.stringify(commands[i].texts[iText])
          + ", skip it." );
        commands[i].texts.splice(iText,1); // Remove that text
        iText--; // Jump back in the text list so we don't leave the next item unchecked
      }
    }
    
    // Check that the action has been given and is a string
    // TODO: Check the the Javascript command is ok
    if( typeof commands[i].action !== "string" ) {
      console.log( "Txtcmd::set   The action has not been given or is not a string of JavaScript: "
        + EJSON.stringify( commands[i].action ) + ", skip this command." );
      continue;
    }
    
    // Add the command to the database collection
    self.Commands.insert(commands[i]);
  }
  
  //console.log( "Txtcmd::set   Added commands. Now " + self.Commands.find().count() + " commands in DB." );
  return true;
}



// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  
});



//////////////////////////// END OF FILE ////////////////////////////
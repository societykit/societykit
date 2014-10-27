//////////////////////////// ELEMENT: TXTCMD ////////////////////////////
/*
Interprets textual commands given by the user via the browser URL or
some textual input element of the application.
*/
Txtcmd = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Txtcmd.Commands = new Meteor.Collection("txtcmdCommands");
Meteor.subscribe("txtcmdCommands", function() {
  console.log("Txtcmd::subscribe: Registered " + Txtcmd.Commands.find().count() +  " commands." );
  Url.txtcmdStarted();
});

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE
//// EVENTS

//////////////////////////// CONTROLLER ////////////////////////////
Txtcmd.computation = Tracker.autorun(function() {
  //// OWN VARIABLES
  //Object.defineProperties(Txtcmd, {});
  
  //// INTERFACE FOR OTHER ELEMENTS
  
  // This function returns actions that the given text command is most probably requesting
  Txtcmd.get = function (txt, context) {
    
    // Default value for 'context'
    if( typeof context === "undefined" ) {
      context = "current";
    }
    
    // Actions to be done because of the interpretation of the text command
    var actions = [];
    // Available commands
    var commands = this.Commands.find().fetch();
    
    // Go through all commands
    for( var i = 0; i < commands.length; i++ ) {
      
      // TODO Use the defined 'context', all keywords related to the command, and all parameters related to it
      
      // Go through all altenative texts of the command
      for( var j = 0; j < commands[i].texts.length; j++ ) {

        // Is this a match
        if( commands[i].texts[j] === txt ) {
          
          // Calculate certainty for this command
          commands[i].certainty = 100;
          
          // Push to commands that match the text
          actions.push(commands[i]);
        }
      }
    }
    
    // TODO: Find out the best match of the found commands
    
    console.log( "Txtcmd::get: txt=" + txt + ", context=" + EJSON.stringify(context) + ", actions=" + EJSON.stringify(actions) );
    
    // Return possible actions
    return actions;
  }
  
  //// CONNECT TO OTHER ELEMENTS
  //Meteor.startup(function(){});
});

//////////////////////////// END OF FILE ////////////////////////////
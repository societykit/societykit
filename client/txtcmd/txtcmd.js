//////////////////////////// ELEMENT: TXTCMD ////////////////////////////
// * * * CREATE OBJECT
Txtcmd = {};
console.log("Txtcmd::constructor   Object created.");


//////////////////////////// MODEL ////////////////////////////
/*

  _id               object id
  
  id                string (to be used in the code)
  title             string
  
  
LATER:
  
  
*/

// * * * DATABASE COLLECTION
Txtcmd.Commands = new Meteor.Collection("txtcmdCommands");
Meteor.subscribe("txtcmdCommands", function() {
  console.log("Txtcmd::subscribe   Meteor server is ready now with " + Txtcmd.Commands.find().count() +  " commands." );
  Url.txtcmdStarted();
});






// * * * INITIALIZE
Meteor.startup(function(){
  
  // Nothing to do here at client.
  
});







//////////////////////////// VIEW ////////////////////////////

// * * * TEMPLATE
/*Txtcmd.template = Template.txtcmd;

Txtcmd.template.helpers({});


Txtcmd.template.fn = function () {}


// * * * EVENTS
Txtcmd.template.events({});

*/








//////////////////////////// CONTROLLER ////////////////////////////

Txtcmd.computation = Deps.autorun(function() {
  
  
  // * * * OWN VARIABLES
  Object.defineProperties(Txtcmd, {
    
  });
  
  
  





  // * * * INTERFACE FOR OTHER ELEMENTS

  // Return commands that this text might mean
  Txtcmd.get = function (txt, context) {
    
    console.log( "Txtcmd::get   txt=" + txt + ", context=" + EJSON.stringify(context) );
    
    
    // Default value
    if( typeof context === "undefined" ) {
      context = "current";
    }
    
    var actions = [];
    var commands = this.Commands.find().fetch();
    
    console.log( "Checking all "+commands.length+" commands." );
      
    // Go through all commands
    for( var i = 0; i < commands.length; i++ ) {
      
      console.log( "Txtcmd::get   Checking command: " + EJSON.stringify(commands[i]) );
      
      // TODO Use the defined 'context', all keywords related to the command, and all parameters related to it
      
      // Go thourgh all altenative texts of the command
      for( var j = 0; j < commands[i].texts.length; j++ ) {
        
        console.log( "Compare: " + commands[i].texts[j] +"='"+txt + "'?" );
        
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
    
    // Return possible actions
    return actions;
    
  }







  // * * * CONNECT TO OTHER ELEMENTS
  Meteor.startup(function(){
    
  });



});



//////////////////////////// END OF FILE ////////////////////////////
/*






*/
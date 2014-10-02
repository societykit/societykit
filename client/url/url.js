//////////////////////////// ELEMENT: PAGE ////////////////////////////
/*
Handles the browser's URL address bar
*/
Url = {};

//////////////////////////// MODEL ////////////////////////////
//// DATABASE COLLECTION
//Url.data = new Meteor.Collection("url");
//Meteor.subscribe("url");

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////

//// TEMPLATE
//Url.template = Template.url;
//Url.template.helpers({});
//Url.template.content = function () {}

UrlExtender = Backbone.Router.extend({
  
//// EVENTS
  routes: {
    "*input": "input"
  },
  input: function (input) {
    Url._input(input);
  }
});
Url.router = new UrlExtender;

//Url.template.events({});


//////////////////////////// CONTROLLER ////////////////////////////
Url._base = "localhost:3000/";
Url._input = function (input) {
  // Set text input source
  input = {
    tStart: new Date().getTime(),
    what: "input",
    type: "text",
    text: input,
    source: "url"
  };
  
  // Clean from attacks
  // TODO: Not needed?
  var inputCleaned = SafeText.clean(input);
  //  = {
  //  text:
  //  cleanliness:
  // }
  
  // Ask txtcmd
  var commands = Txtcmd.get(inputCleaned.text);
  if( !commands.length ) {
    return false;
  }
  else {
    // Check which command is most important
    var command = commands[0];
    console.log( "Url::input " + Url._base+", input="+EJSON.stringify(input) + ". Run command='" + EJSON.stringify( command ) + "'.");
    if( typeof command !== "undefined" ) {
      // Run the command
      eval( command.action );
    }
  }
}

Url.set = function (set) {
  // No URL set?
  if( typeof set.url == "undefined" ) {
    // Use current url
    //set.url = 
    console.log("Url::set   Undefined url, return FALSE.");
    return false;
  }
  // Default values
  if( typeof set.trigger == "undefined" ) {
    set.trigger = true;
  }
  Url.router.navigate(set.url, {replace: !set.trigger});
}

Url.setCleaned = function (cleaned) {
  console.log( "Url::setCleaned   "+EJSON.stringify(cleaned) );
  this.set({url: cleaned.url, trigger: false });
}

Url.writeUrl = function () {
  // Define the URL text based on the registered elements' states
  // For now, just write the page name
  if( typeof Url._registeredElements["Page"]["pageCurrent"] !== "undefined" ) {
    var url = Url._registeredElements["Page"]["pageCurrent"];
    if( url === "home" ) {
      url = "";
    }
  }
  else {
    var url = "";
  }
  
  // Update url
  console.log("Url::writeUrl: Change browser URL into \""+Url._base+url+"\"");
  Url.set({url: url, trigger: false});
}

//// OWN VARIABLES
/*Object.defineProperties(Url, {});*/
Url._registeredElements = {
  //element: sessionVariable
};

// 10? (they can take turns, depending on which part of the website the user is vising)
Url._maxNumberOfUrlUsingElements = 2;

//// INTERFACE FOR OTHER ELEMENTS
Url.txtcmdStarted = function () {
  console.log("Url::txtcmdStarted: Start Backbone history now.");
  Backbone.history.start({pushState: true});
}

/*
Function: URL::REGISTER(who, sessionVariable)
Description: 
Used by: Page, Banner?, ...
*/
Url.register = function ( who, sessionVariable ) {
  console.log("Url::register: Element '"+who+"' registers session variable '"+sessionVariable+"'." );
  
  // Create a container object for this element, if it doesn't exist already.
  if( typeof Url._registeredElements[who] === "undefined" ) {
    Url._registeredElements[who] = {};
  }
  
  // A registered session variable has changed?
  Tracker.autorun(function(){
    console.log("Url::register::autorun: The value of the URL-dependent variable '"
      + who + "."+sessionVariable+"' has changed to '" + Session.get(sessionVariable) + "'." );
    
    // Set the value
    Url._registeredElements[who][sessionVariable] = Session.get(sessionVariable);
    Url.writeUrl();
  });
}

//// CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){});

//////////////////////////// END OF FILE ////////////////////////////
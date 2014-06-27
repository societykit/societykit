//////////////////////////// ELEMENT: PAGE ////////////////////////////
// * * * CREATE OBJECT
Url = {};
console.log("Url::constructor   Object created.");


//////////////////////////// MODEL ////////////////////////////
/*
  
  No data for Url.
  
*/

// * * * DATABASE COLLECTION
/*
Url.data = new Meteor.Collection("url");
Meteor.subscribe("url");


// * * * INITIALIZE
Meteor.startup(function(){
  // Nothing to do here at client.
});

*/






//////////////////////////// VIEW ////////////////////////////

// * * * TEMPLATE
//Url.template = Template.url;
//Url.template.helpers({});
//Url.template.content = function () {}

UrlExtender = Backbone.Router.extend({
  
// * * * EVENTS

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
  var self = Url;
  
  // Set text input source
  input = {
    tStart: new Date().getTime(),
    what: "input",
    type: "text",
    text: input,
    source: "url"
  };
  
  // input (string) = user's input on browser
  console.log( "Url::_input   "+self._base+"input: "+EJSON.stringify(input) );
  Dev.debug( "Url::_input   "+input.text );
  
  // Clean from attacks
  // TODO: Not needed?
  var inputCleaned = SafeText.clean(input);
  //  = {
  //  text:
  //  cleanliness:
  // }
  
  // Ask txtcmd
  var commands = Txtcmd.get(inputCleaned.text);
  console.log( "Url::input   Commands received: " + JSON.stringify(commands) );
  if( !commands.length ) {
    return false;
  }
  else {
    // Check which command is most important
    var command = commands[0];
    console.log( "Url::input   Command determined=: " + EJSON.stringify( command ) );
    if( typeof command !== "undefined" ) {
      // Run the command
      eval( command.action );
    }
  }
}

Url.set = function (set) {
  var self = Url;
  
  console.log( "Url::set   "+EJSON.stringify(set) );
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
  self.router.navigate(set.url, {replace: !set.trigger});
}

Url.setCleaned = function (cleaned) {
  console.log( "Url::setCleaned   "+EJSON.stringify(cleaned) );
  this.set({url: cleaned.url, trigger: false });
}

Url.writeUrl = function () {
  var self = Url;
  
  console.log( "Url::writeUrl   Registered elements for URL address: "+EJSON.stringify( self._registeredElements["Page"] ) );
  // Define the URL text based on the registered elements' states
  // For now, just write the page name
  if( typeof self._registeredElements["Page"]["pageCurrent"] !== "undefined" ) {
    var url = self._registeredElements["Page"]["pageCurrent"];
    if( url === "home" ) {
      url = "";
    }
  }
  else {
    var url = "";
  }
  
  // Update url
  console.log("Url::writeUrl   \""+self._base+url+"\"");
  Url.set({url: url, trigger: false});
}



// * * * OWN VARIABLES

/*Object.defineProperties(Url, {
  
});*/
Url._registeredElements = {
  //element: sessionVariable
};
Url._maxNumberOfUrlUsingElements = 2;    // 10? (they can take turns, depending on which part of the website the user is vising)
  



// * * * INTERFACE FOR OTHER ELEMENTS
Url.txtcmdStarted = function () {
  console.log("Url::txtcmdStarted   Start Backbone history now.");
  Backbone.history.start({pushState: true});
}

// Used by: Page, Banner?, ...
Url.register = function ( who, sessionVariable ) {
  var self = Url;
  console.log("Url::register   Element "+who+" registers session variable "+sessionVariable+"." );
  
  // Create container object, if non-existent
  if( typeof self._registeredElements[who] === "undefined" ) {
    console.log("Url::register   Create registered elements sub section for '"+who+"'.");
    self._registeredElements[who] = {};
  }
  
  // A registered session variable has changed?
  Deps.autorun(function(){
    console.log("Url::register::autorun   Value changed: " + who + "."+sessionVariable+" = " + Session.get(sessionVariable));
    
    // Set the value
    self._registeredElements[who][sessionVariable] = Session.get(sessionVariable);
    console.log( "Url::register::autorun   Updated registered elements:" + EJSON.stringify( self._registeredElements ) );
    
    //var setValue = "temp-value";
    /*self._registeredElements.append({
        element: who,
        variable: Session.get(sessionVariable)
    });*/
    
    self.writeUrl();
  });
  
}


// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  
});




//////////////////////////// END OF FILE ////////////////////////////
/*




*/



// INTERFACE FOR PACKAGE USERS //

// Export this variable
Url = {};

Url.register = function ( params ) {  
  /*
  Operation: Registers a session variable to be included/controlled in the URL
  params = {
    name: "mainPage",
    title: "",
    defaultValue: "home",
    values: [
      {
        value: "home",
        text: ""
      },
      {
        value: "about",
        text: "about"
      },
      {
        value: "contact",
        text: "contact"
      }
    ]
  }
  */
  
  // TODO: Check that no other variable is registered with the same name or title
  
  // TODO: Order of variables
  //console.log("societykit:url :: register :: Params = " + EJSON.stringify(params));
  registered.push( params );
  
  // When this session variable changes value, rewrite the URL
  Tracker.autorun(function(){
    Session.get(params.name);
    urlSet();
  });
  
  return true;
}



// INTERNAL LOGIC //

// Save here the possible values of each registered session variable
var registered = [];

var router = new Backbone.Router.extend({
  // Handle all possible URL routes (.../.../)
  // in a custom way, defined below in the 'processUrl' function
  routes: {
    "*input": "input"
  },
  
  // Function to handle all URL input texts
  input: function (str) {
      
    console.log("societykit:url :: input :: str="+str);
    
    // Get variables, separated by '/''
    var variables = str.split('/');
    
    // Save here which variables have been defined
    var defined = {};
    
    // Process each variable
    for( var iUrl in variables ) {
      
      // Get name and value of variable
      var splitIndex = variables[iUrl].indexOf(':');
      var name;
      var value;
      
      // Not the no-title variable?
      if( splitIndex != -1 ) {
        var name = variables[iUrl].substring(0, splitIndex);
        var value = variables[iUrl].substring(splitIndex);
      }
      // The no-title variable?
      else {
        // Empty title
        var name = "";
        // Take the whole string as the value
        value = variables[iUrl];
      }
      
      // Identify the variable
      for( var iReg in registered ) {
        
        // This registered var has the same title as the given url var's name
        // TODO: Recognize and allow the almost-exact url input strings
        if( registered[ iReg ].title === name ) {
          
          // Save the name of the identified session variable
          defined[ registered[ iReg ].name ] = value;
          
          // Stop going through the registered vars
          break;
        }
      }
    }
    
    console.log("societykit:url :: input :: defined="+EJSON.stringify(defined));
    
    
    // Now the identified session variables have been listed
    // Next, set all the registered session variables
    for( var iReg in registered ) {
      
      // This variable has been defined in the URL?
      if( typeof defined[ registered[ iReg ].name ] !== "undefined" ) {
        // Set the value of the variable
        Session.set( registered[ iReg ].name, defined[ registered[ iReg ].name ] );  
      }
      
      // Not defined?
      else {
        // Set the default value
        Session.set( registered[ iReg ].name, registered[ iReg ].defaultValue );
      }
    }
    
    // Finally, clean up the URL string
    urlSet(false);
    
    // All done.
    return;
  }
});
//console.log("Router: " + EJSON.stringify(Object.keys( router )));


function urlSet (addBrowserHistory) {
  /*
  Operation:
    Goes through the current values of the registered session variables and
    writes a clean URL according to them.
  */
  
  // Cleaned URL goes here
  var url = "";
  
  // Go through all registered variables
  for( var iReg in registered ) {
    
    // Variable value
    var value = Session.get( registered[ iReg ].name );
    
   // console.log("societykit:url :: urlSet :: session var("+registered[iReg].name+
   //   ")=" + EJSON.stringify(value));
  
    // If not default value, then add it to the string
    if( value !== registered[iReg].defaultValue ) {
      
      // If not the first variable, add separator "/"
      if( url !== "" ) {
        url += "/";
      }
      
      // Not the no-title variable?
      if( registered[iReg].title !== "" ) {
        // Add variable title and ": "
        url += registered[iReg].title + ": ";
      }
      
      // Add the value
      url += value;
    }
  }
  
//  console.log("societykit:url :: urlSet :: Set url: " + url);
  // Now the url string has been created.
  // Next, insert it to the browser's URL field
  
  // TODO: Make this work
  //router.navigate( url, { replace: !addBrowserHistory });
  
  return;
}



// Start the backbone router's history, after Meteor has started up
Meteor.startup(function(){
 //console.log("Ready to start Backbone history.");
  //console.log("societykit:url :: Hello! Backbone: " + EJSON.stringify(typeof Backbone));
  //Backbone.history.start({pushState: true});
  
  urlSet();
});



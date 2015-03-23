// Interface
skitSession = {};

// Sets session value but first calls any functions registered for that session var
skitSession.set = function( variable, value ) {
  
  // Run functions if any are registered
  if( typeof _skitSession.callbacks[ variable ] === "function" ) {
    _skitSession.callbacks[ variable ]( Session.get(variable), value );
  }
  // Set new value
  Session.set(variable, value);
}

// Sets default session value but first calls any function registered for that session var
skitSession.setDefault = function( variable, value ) {
  if( typeof Session.get(variable) === "undefined" ) {
    skitSession.set(variable, value);
  }
}

// Register a function to be called when the session var value is changed
// The function should have two parameters: oldValue, newValue
skitSession.registerCallback = function ( variable, fn ) {
  _skitSession.callbacks[ variable ] = fn;
}


// Private properties and functions
var _skitSession = {};
_skitSession.callbacks = {};



Template.skitSessionSet.events({
  
  // When clicking a skitSessionSet link, set all the session variable values
  // that have been defined as context variables
  "click a": function(e) {
    // Set all variables
    var keys = Object.keys(this);
    for( var i in keys ) {
      skitSession.set(keys[i],this[keys[i]]);
    }
  }
  
});


// Returns true/false = whether the given session variable equals the given value
Template.registerHelper( "skitSessionEquals", function ( variable, value ) {
  return Session.equals( variable, value );
});
Template.registerHelper( "sessionEquals", function ( variable, value ) {
  return Session.equals( variable, value );
});

Template.registerHelper( "skitSessionGet", function ( variable ) {
  return Session.get( variable );
});
Template.registerHelper( "sessionGet", function ( variable ) {
  return Session.get( variable );
});




// When the website is first loaded, call all the callbacks that depend on the session variables
Meteor.startup(function(){
  
  for( var variable in _skitSession.callbacks ) {
    _skitSession.callbacks[ variable ](undefined, Session.get(variable));
  }
});



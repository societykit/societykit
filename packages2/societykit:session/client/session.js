Template.sessionSet.events({
  
  // When clicking a sessionSet link, set all the session variable values
  // that have been defined as context variables
  "click a": function(e) {
    // Set all variables
    var keys = Object.keys(this);
    for( var i in keys ) {
      Session.set(keys[i], this[keys[i]]);
    }
  }
  
});

// Returns true/false = whether the given session variable equals the given value
Template.registerHelper( "sessionEquals", function ( variable, value ) {
  return Session.equals( variable, value );
});

Template.registerHelper( "sessionGet", function ( variable ) {
  return Session.get( variable );
});

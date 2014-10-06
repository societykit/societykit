//////////////////////////// ELEMENT: OBJECTS ////////////////////////////
/*
- An abstract class for handling any kinds of "objects".
- Includes functionalities for adding/elementing/deleting these objects
on the user interface.
*/
Objects = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Objects.Data = new Meteor.Collection("objects");
Meteor.subscribe("objects");

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE: OBJECTS
Objects.template = Template.objects;

Objects.template.list = function() {
  return Objects.Data.find();
}
//Objects.template.helpers({});

//// TEMPLATE: OBJECT
Objects.object = {};
Objects.object.template = Template.object;

// Function: get state
Objects.object._getState = function(_id) {
  var parent = Objects;
  
  var states = parent._states;
  var state = states[_id];
  if( typeof state === "undefined" ) {
    state = parent.object._defaultState;
  }
  
  return state;
}


Objects.object.template.isState = function(state) {
  var parent = Objects;
  var self = this;
  
  //console.log( "Objects::object::template::isState   " + this._id + ": " + state + "="+current+" > " + (state === current) );
  return (state === parent.object._getState(self._id));
}
//Objects.object.template.helpers({});


Objects.object.template.edit = Template.objectEdit;
Objects.object.template.edit.checked = function (field, value) {
  var parent = Objects;
  var tmpl = this;
  console.log( "Tmpl="+EJSON.stringify(tmpl) );
  
  if( tmpl[field] === value ) {
    return 'checked="checked" ';
  }
  else {
    return '';
  }
}
Objects.object.template.edit.selected = function (field, value) {
  var parent = Objects;
  var tmpl = this;
  console.log( "Tmpl="+EJSON.stringify(tmpl) );
  
  if( tmpl.selected === tmpl.value ) {
    return 'selected="selected" ';
  }
  else {
    return '';
  }
}

Objects.object.template.add = Template.objectAdd;
Objects.object.template.add.dropdownValues = function () {
  
  //var objects2 = Objects2.get();
  // TODO Selected - under if statement. Put the 'selected:"selected"' field only on the selected object.
  
  // TODO Check if the current value is invalid/outdated, inform this to the user on the screen
  
  return [{value:"id1",title:"DD1",selected:this.dropdown}, {value:"id2",title:"DD2",selected:this.dropdown}];
}
Objects.object.template.edit.dropdownValues = Objects.object.template.add.dropdownValues;






Objects.object.validate = function(data) {
  var isValid = true;
  var invalids = {};
  
  if( typeof data.name === "undefined" ) {
    invalids[data.name] = "Sorry, error on the website.";
    console.log("Objects::object::validate   Data: "+EJSON.stringify(data)+" -> name is missing." );
    isValid = false;
  }
  
  if( !data.name.length ) {
    invalids[data.name] = "Txt 1 must not be empty.";
    isValid = false;
  }
  // TODO: Unique name for txt 1?
  
  if( isValid ) {
    console.log( "Objects::object::validate   Data: "+EJSON.stringify(data)+" -> Valid!" );
    return false;
  }
  else {
    console.log( "Objects::object::validate   Data: "+EJSON.stringify(data)+" -> Invalid values: " + EJSON.stringify(invalids) );
    return invalids;
  }
}



//// EVENTS
Objects.template.events({
  
  // KEYBOARD NAVIGATION & MANIPULATION
  
  // TODO Use arrow keys, tab, enter and esc to navigate and edit objects
  
  
  // TODO Click outside everything --> remove listDetails
  
  
  // OBJECT: ADD
  'click #objectAdd .add': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('#objectAdd').serializeArray(), function(){ form[this.name] = this.value; });
    
    console.log( "Form data = " + EJSON.stringify(form) );
    
    // Validations for form data
    var invalids = parent.object.validate(form);
    
    if( !invalids ) {
      parent.Data.insert(form,
        function(error) {
          if( !error ) {
            console.log("Objects::add   Added object " + EJSON.stringify( form ) );
            $('#objectAdd')[0].reset();
          }
          else {
            console.log("Objects::add   Error in adding object:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Objects::add   Not valid form data given." );
    }
    /*
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var coords = Session.get("createCoords");
    */
    
  },
  'click #objectAdd .cancel': function (evt, tmpl) {
    console.log("Objects::add   Reset form.");
    //$('.objectAdd')[0].reset();
    //return false;
  }
  // TODO: Automatic validations
});


Objects.object.template.events({
  
  // OBJECT: LIST
  'click .objectList': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    console.log( "Objects::" + context._id + "::click.list" );
    
    // Show details on object
    parent._states = {listDetails:context._id};
  },
  
  // OBJECT: SELECT
  'click .objectSelect': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    console.log( "Objects::" + context._id + "listDetails" );
    parent._states = {list:context._id};
  },
  
  // OBJECT: LIST DETAILS
  'click .objectListDetails': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    console.log( "Objects::" + context._id + "::list" );
    parent._states = {list:context._id};
  },
  'click .objectListDetails .open': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    console.log( "Objects::" + context._id + "::open" );
    parent._states = {view:context._id};
    evt.stopImmediatePropagation();
  },
  
  // OBJECT: VIEW
  
  'click .objectView .close': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    console.log( "Objects::" + context._id + "::close" );
    parent._states = {listDetails:context._id};
  },
  'click .objectView .edit': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    console.log( "Objects::" + context._id + "::edit" );
    parent._states = {edit:context._id};
  },
  'click .objectView .remove': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    console.log( "Objects::" + context._id + "::remove" );
    parent._states = {remove:context._id};
  },
  
  
  // OBJECT: EDIT
  
  'click .objectEdit .edit': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    console.log( "Objects::" + context._id + "::edit::commit" );
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('.objectEdit').serializeArray(), function(){ form[this.name] = this.value; });
    
    // Validations for form data
    var invalids = parent.object.validate(form);
    
    if( !invalids ) {
      parent.Data.update({_id:context._id},{$set:form},{},
        function(error, affectedRowsCount) {
          if( !error ) {
            console.log("Objects::" + context._id + "edit   Edited object " + EJSON.stringify( form ) );
            parent._states = {view:context._id};
          }
          else {
            console.log("Objects::" + context._id + "edit   Error in editing object:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Objects::" + context._id + "edit   Not valid form data given." );
    }
  },
  'click .objectEdit .cancel': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    console.log( "Objects::" + context._id + "::edit::cancel" );
    parent._states = {view:context._id};
  },
  // TODO: Automatic validations
  
  
  // OBJECT: REMOVE
  'click .objectRemove .remove': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    console.log( "Objects::" + context._id + "::remove::confirm" );
    
    evt.preventDefault();
    
    parent.Data.remove({_id:context._id},
      function(error) {
        if( !error ) {
          console.log("Objects::" + context._id + "remove   Removed object." );
          parent._states = {list:context._id};
        }
        else {
          console.log("Objects::" + context._id + "remove   Error in removing object:" + EJSON.stringify(error) );
        }
      }
    );
  },
  'click .objectRemove .cancel': function (evt, tmpl) {
    var parent = Objects;
    var context = this;
    console.log( "Objects::" + context._id + "::remove::cancel" );
    parent._states = {view:context._id};
  }
  
});




//////////////////////////// CONTROLLER ////////////////////////////

Session.setDefault("objectsStates","{}");
Objects.object._defaultState = "list";
Objects._multiObjectStates = ["select"];

Object.defineProperties(Objects, {
  
  _states: {
    
    get: function () {
      return EJSON.parse( Session.get("objectsStates") );
    },
    
    set: function (update) {
      var self = Objects;
      var states = EJSON.parse( Session.get("objectsStates") );
      
      // Get update object (usually only for iteration is made)
      for(var state in update) {
        
        // Id of the object to be updated
        var id = update[state];
        
        // Set default state for all other objects
        for( otherId in states ) {
          
          // The set object's state is NOT in the same state as this object, or this object is NOT in a multi-object state?
          if( state !== states[otherId] || ($.inArray( states[otherId] === -1), self._multiObjectStates ) ) {
            // Set to default state
            delete states[otherId];
          }
        }
        
        // Set default state for this object?
        if( state === self.object._defaultState ) {
          // Remove object
          delete states[id];
        }
        // Non-default state?
        else {
          // Save the new state
          states[id] = state;
        }
      }
      
      // Save in the session variable
      Session.set("objectsStates", EJSON.stringify(states));
    }
  }
});

/*Objects.computation = Tracker.autorun(function() {
  //////// OWN VARIABLES
  //Object.defineProperties(Objects, {});
});
*/

//////// INTERFACE FOR OTHER ELEMENTS
// Function: get objects data
Objects.get = function (selector) {
  console.log("Objects::get");
  var self = Objects;
  
  if( typeof selector !== "object" ) {
    selector = {};
  }
  
  var data = self.Data.find();
  
  // TODO Some access control?
  
  return data;
}




// * * * CONNECT TO OTHER ELEMENTS
//Meteor.startup(function(){});


//////////////////////////// END OF FILE ////////////////////////////
/*

*/
//////////////////////////// ELEMENT: SOURCES ////////////////////////////
/*
- Handles data about "sources": adding/elementing/deleting
*/
Sources = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Sources.Data = new Meteor.Collection("sources");
Meteor.subscribe("sources");

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE: SOURCES
Sources.template = Template.sources; // Rename the template

// Function: Lists all the sources in the database
Sources.template.list = function() {
  return Sources.Data.find();
}

//// TEMPLATE: (A SINGLE) SOURCE
Sources.source = {};
Sources.source.template = Template.source;

// Function: get state (= is the source item shown in list, view, edit or remove mode
Sources.source._getState = function(_id) {
  var states = Sources._states;
  var state = states[_id];
  if( typeof state === "undefined" ) {
    state = Sources.source._defaultState;
  }
  return state;
}

// Function: return true, if the state (view, editing, removing, etc.) of the source is the same as given in the parameter
Sources.source.template.isState = function(state) {
  return (state === Sources.source._getState(this._id));
}


//// TEMPLATE: EDIT A SOURCE
Sources.source.template.edit = Template.sourceEdit; // Rename the template

// Function: mark that the value of the field "field" is checked to be "value", if it is so
Sources.source.template.edit.checked = function (field, value) {
  if( this[field] === value ) {
    return 'checked="checked" ';
  }
  else {
    return '';
  }
}
// Function: mark that the value of the field "field" is selected to be "value", if it is so
Sources.source.template.edit.selected = function (field, value) {
  if( this.selected === this.value ) {
    return 'selected="selected" ';
  }
  else {
    return '';
  }
}


//// TEMPLATE: ADD A SOURCE
Sources.source.template.add = Template.sourceAdd; // Rename the template
Sources.source.template.add.mediatypeValues = function () {
  //var sources2 = Sources2.get();
  // TODO Selected - under if statement. Put the 'selected:"selected"' field only on the selected source.
  
  // TODO Check if the current value is invalid/outdated, inform this to the user on the screen
  
  return [
    {value:"literature",title:"Literature",selected:this.dropdown}, 
    {value:"www",title:"WWW",selected:this.dropdown}, 
    {value:"other",title:"Other",selected:this.dropdown}
  ];
}
Sources.source.template.edit.mediatypeValues = Sources.source.template.add.mediatypeValues;

Sources.source.template.add.availabilityValues = function () {
  //var sources2 = Sources2.get();
  // TODO Selected - under if statement. Put the 'selected:"selected"' field only on the selected source.
  // TODO Check if the current value is invalid/outdated, inform this to the user on the screen
  return [
    {value:"available",title:"Available",selected:this.dropdown}, 
    {value:"restrictedAccess",title:"Restricted access",selected:this.dropdown}, 
    {value:"unavailable",title:"Unavailable",selected:this.dropdown}
  ];
}
Sources.source.template.edit.availabilityValues = Sources.source.template.add.availabilityValues;



Sources.source.validate = function(data) {
  var isValid = true;
  var invalids = {};
  
  if( typeof data.name === "undefined" ) {
    invalids[data.name] = "Sorry, error on the website.";
    console.log("Sources::source::validate   Data: "+EJSON.stringify(data)+" -> name is missing." );
    isValid = false;
  }
  
  if( !data.name.length ) {
    invalids[data.name] = "Txt 1 must not be empty.";
    isValid = false;
  }
  // TODO: Unique name for txt 1?
  
  if( isValid ) {
    console.log( "Sources::source::validate   Data: "+EJSON.stringify(data)+" -> Valid!" );
    return false;
  }
  else {
    console.log( "Sources::source::validate   Data: "+EJSON.stringify(data)+" -> Invalid values: " + EJSON.stringify(invalids) );
    return invalids;
  }
}



//// EVENTS
Sources.template.events({
  
  // KEYBOARD NAVIGATION & MANIPULATION
  
  // TODO Use arrow keys, tab, enter and esc to navigate and edit sources
  
  
  // TODO Click outside everything --> remove listDetails
  
  
  // SOURCE: ADD
  'click #sourceAdd .add': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('#sourceAdd').serializeArray(), function(){ form[this.name] = this.value; });
    
    console.log( "Form data = " + EJSON.stringify(form) );
    
    // Validations for form data
    var invalids = parent.source.validate(form);
    
    if( !invalids ) {
      parent.Data.insert(form,
        function(error) {
          if( !error ) {
            console.log("Sources::add   Added source " + EJSON.stringify( form ) );
            $('#sourceAdd')[0].reset();
          }
          else {
            console.log("Sources::add   Error in adding source:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Sources::add   Not valid form data given." );
    }
    /*
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var coords = Session.get("createCoords");
    */
    
  },
  'click #sourceAdd .cancel': function (evt, tmpl) {
    console.log("Sources::add   Reset form.");
    //$('.sourceAdd')[0].reset();
    //return false;
  }
  // TODO: Automatic validations
});


Sources.source.template.events({
  
  // SOURCE: LIST
  'click .sourceList': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    console.log( "Sources::" + context._id + "::click.list" );
    
    // Show details on source
    parent._states = {listDetails:context._id};
  },
  
  // SOURCE: SELECT
  'click .sourceSelect': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    console.log( "Sources::" + context._id + "listDetails" );
    parent._states = {list:context._id};
  },
  
  // SOURCE: LIST DETAILS
  'click .sourceListDetails': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    console.log( "Sources::" + context._id + "::list" );
    parent._states = {list:context._id};
  },
  'click .sourceListDetails .open': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    console.log( "Sources::" + context._id + "::open" );
    parent._states = {view:context._id};
    evt.stopImmediatePropagation();
  },
  
  // SOURCE: VIEW
  
  'click .sourceView .close': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    console.log( "Sources::" + context._id + "::close" );
    parent._states = {listDetails:context._id};
  },
  'click .sourceView .edit': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    console.log( "Sources::" + context._id + "::edit" );
    parent._states = {edit:context._id};
  },
  'click .sourceView .remove': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    console.log( "Sources::" + context._id + "::remove" );
    parent._states = {remove:context._id};
  },
  
  
  // SOURCE: EDIT
  
  'click .sourceEdit .edit': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    console.log( "Sources::" + context._id + "::edit::commit" );
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('.sourceEdit').serializeArray(), function(){ form[this.name] = this.value; });
    
    // Validations for form data
    var invalids = parent.source.validate(form);
    
    if( !invalids ) {
      parent.Data.update({_id:context._id},{$set:form},{},
        function(error, affectedRowsCount) {
          if( !error ) {
            console.log("Sources::" + context._id + "edit   Edited source " + EJSON.stringify( form ) );
            parent._states = {view:context._id};
          }
          else {
            console.log("Sources::" + context._id + "edit   Error in editing source:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Sources::" + context._id + "edit   Not valid form data given." );
    }
  },
  'click .sourceEdit .cancel': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    console.log( "Sources::" + context._id + "::edit::cancel" );
    parent._states = {view:context._id};
  },
  // TODO: Automatic validations
  
  
  // SOURCE: REMOVE
  'click .sourceRemove .remove': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    console.log( "Sources::" + context._id + "::remove::confirm" );
    
    evt.preventDefault();
    
    parent.Data.remove({_id:context._id},
      function(error) {
        if( !error ) {
          console.log("Sources::" + context._id + "remove   Removed source." );
          parent._states = {list:context._id};
        }
        else {
          console.log("Sources::" + context._id + "remove   Error in removing source:" + EJSON.stringify(error) );
        }
      }
    );
  },
  'click .sourceRemove .cancel': function (evt, tmpl) {
    var parent = Sources;
    var context = this;
    console.log( "Sources::" + context._id + "::remove::cancel" );
    parent._states = {view:context._id};
  }
  
});




//////////////////////////// CONTROLLER ////////////////////////////

Session.setDefault("sourcesStates","{}");
Sources.source._defaultState = "list";
Sources._multiSourceStates = ["select"];

Object.defineProperties(Sources, {
  
  _states: {
    
    get: function () {
      return EJSON.parse( Session.get("sourcesStates") );
    },
    
    set: function (update) {
      var self = Sources;
      var states = EJSON.parse( Session.get("sourcesStates") );
      
      // Get update object (usually only for iteration is made)
      for(var state in update) {
        
        // Id of the source to be updated
        var id = update[state];
        
        // Set default state for all other sources
        for( otherId in states ) {
          
          // The set source's state is NOT in the same state as this source, or this source is NOT in a multi-source state?
          if( state !== states[otherId] || ($.inArray( states[otherId] === -1), self._multiSourceStates ) ) {
            // Set to default state
            delete states[otherId];
          }
        }
        
        // Set default state for this source?
        if( state === self.source._defaultState ) {
          // Remove source
          delete states[id];
        }
        // Non-default state?
        else {
          // Save the new state
          states[id] = state;
        }
      }
      
      // Save in the session variable
      Session.set("sourcesStates", EJSON.stringify(states));
    }
  }
});

/*Sources.computation = Tracker.autorun(function() {
  //////// OWN VARIABLES
  //Object.defineProperties(Sources, {});
});
*/

//////// INTERFACE FOR OTHER ELEMENTS
// Function: get sources data
Sources.get = function (selector) {
  console.log("Sources::get");
  var self = Sources;
  
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
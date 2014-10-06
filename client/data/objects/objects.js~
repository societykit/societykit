//////////////////////////// ELEMENT: PERSONS ////////////////////////////
/*
- An abstract class for handling any kinds of "persons".
- Includes functionalities for adding/elementing/deleting these persons
on the user interface.
*/
Persons = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Persons.Data = new Meteor.Collection("persons");
Meteor.subscribe("persons");

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE: PERSONS
Persons.template = Template.persons;

Persons.template.list = function() {
  return Persons.Data.find();
}
//Persons.template.helpers({});

//// TEMPLATE: PERSON
Persons.person = {};
Persons.person.template = Template.person;

// Function: get state
Persons.person._getState = function(_id) {
  var parent = Persons;
  
  var states = parent._states;
  var state = states[_id];
  if( typeof state === "undefined" ) {
    state = parent.person._defaultState;
  }
  
  return state;
}


Persons.person.template.isState = function(state) {
  var parent = Persons;
  var self = this;
  
  //console.log( "Persons::person::template::isState   " + this._id + ": " + state + "="+current+" > " + (state === current) );
  return (state === parent.person._getState(self._id));
}
//Persons.person.template.helpers({});


Persons.person.template.edit = Template.personEdit;
Persons.person.template.edit.checked = function (field, value) {
  var parent = Persons;
  var tmpl = this;
  console.log( "Tmpl="+EJSON.stringify(tmpl) );
  
  if( tmpl[field] === value ) {
    return 'checked="checked" ';
  }
  else {
    return '';
  }
}
Persons.person.template.edit.selected = function (field, value) {
  var parent = Persons;
  var tmpl = this;
  console.log( "Tmpl="+EJSON.stringify(tmpl) );
  
  if( tmpl.selected === tmpl.value ) {
    return 'selected="selected" ';
  }
  else {
    return '';
  }
}

Persons.person.template.add = Template.personAdd;
Persons.person.template.add.dropdownValues = function () {
  
  //var persons2 = Persons2.get();
  // TODO Selected - under if statement. Put the 'selected:"selected"' field only on the selected person.
  
  // TODO Check if the current value is invalid/outdated, inform this to the user on the screen
  
  return [{value:"id1",title:"DD1",selected:this.dropdown}, {value:"id2",title:"DD2",selected:this.dropdown}];
}
Persons.person.template.edit.dropdownValues = Persons.person.template.add.dropdownValues;






Persons.person.validate = function(data) {
  var isValid = true;
  var invalids = {};
  
  if( typeof data.name === "undefined" ) {
    invalids[data.name] = "Sorry, error on the website.";
    console.log("Persons::person::validate   Data: "+EJSON.stringify(data)+" -> name is missing." );
    isValid = false;
  }
  
  if( !data.name.length ) {
    invalids[data.name] = "Txt 1 must not be empty.";
    isValid = false;
  }
  // TODO: Unique name for txt 1?
  
  if( isValid ) {
    console.log( "Persons::person::validate   Data: "+EJSON.stringify(data)+" -> Valid!" );
    return false;
  }
  else {
    console.log( "Persons::person::validate   Data: "+EJSON.stringify(data)+" -> Invalid values: " + EJSON.stringify(invalids) );
    return invalids;
  }
}



//// EVENTS
Persons.template.events({
  
  // KEYBOARD NAVIGATION & MANIPULATION
  
  // TODO Use arrow keys, tab, enter and esc to navigate and edit persons
  
  
  // TODO Click outside everything --> remove listDetails
  
  
  // PERSON: ADD
  'click #personAdd .add': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('#personAdd').serializeArray(), function(){ form[this.name] = this.value; });
    
    console.log( "Form data = " + EJSON.stringify(form) );
    
    // Validations for form data
    var invalids = parent.person.validate(form);
    
    if( !invalids ) {
      parent.Data.insert(form,
        function(error) {
          if( !error ) {
            console.log("Persons::add   Added person " + EJSON.stringify( form ) );
            $('#personAdd')[0].reset();
          }
          else {
            console.log("Persons::add   Error in adding person:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Persons::add   Not valid form data given." );
    }
    /*
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var coords = Session.get("createCoords");
    */
    
  },
  'click #personAdd .cancel': function (evt, tmpl) {
    console.log("Persons::add   Reset form.");
    //$('.personAdd')[0].reset();
    //return false;
  }
  // TODO: Automatic validations
});


Persons.person.template.events({
  
  // PERSON: LIST
  'click .personList': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    console.log( "Persons::" + context._id + "::click.list" );
    
    // Show details on person
    parent._states = {listDetails:context._id};
  },
  
  // PERSON: SELECT
  'click .personSelect': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    console.log( "Persons::" + context._id + "listDetails" );
    parent._states = {list:context._id};
  },
  
  // PERSON: LIST DETAILS
  'click .personListDetails': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    console.log( "Persons::" + context._id + "::list" );
    parent._states = {list:context._id};
  },
  'click .personListDetails .open': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    console.log( "Persons::" + context._id + "::open" );
    parent._states = {view:context._id};
    evt.stopImmediatePropagation();
  },
  
  // PERSON: VIEW
  
  'click .personView .close': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    console.log( "Persons::" + context._id + "::close" );
    parent._states = {listDetails:context._id};
  },
  'click .personView .edit': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    console.log( "Persons::" + context._id + "::edit" );
    parent._states = {edit:context._id};
  },
  'click .personView .remove': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    console.log( "Persons::" + context._id + "::remove" );
    parent._states = {remove:context._id};
  },
  
  
  // PERSON: EDIT
  
  'click .personEdit .edit': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    console.log( "Persons::" + context._id + "::edit::commit" );
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('.personEdit').serializeArray(), function(){ form[this.name] = this.value; });
    
    // Validations for form data
    var invalids = parent.person.validate(form);
    
    if( !invalids ) {
      parent.Data.update({_id:context._id},{$set:form},{},
        function(error, affectedRowsCount) {
          if( !error ) {
            console.log("Persons::" + context._id + "edit   Edited person " + EJSON.stringify( form ) );
            parent._states = {view:context._id};
          }
          else {
            console.log("Persons::" + context._id + "edit   Error in editing person:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Persons::" + context._id + "edit   Not valid form data given." );
    }
  },
  'click .personEdit .cancel': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    console.log( "Persons::" + context._id + "::edit::cancel" );
    parent._states = {view:context._id};
  },
  // TODO: Automatic validations
  
  
  // PERSON: REMOVE
  'click .personRemove .remove': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    console.log( "Persons::" + context._id + "::remove::confirm" );
    
    evt.preventDefault();
    
    parent.Data.remove({_id:context._id},
      function(error) {
        if( !error ) {
          console.log("Persons::" + context._id + "remove   Removed person." );
          parent._states = {list:context._id};
        }
        else {
          console.log("Persons::" + context._id + "remove   Error in removing person:" + EJSON.stringify(error) );
        }
      }
    );
  },
  'click .personRemove .cancel': function (evt, tmpl) {
    var parent = Persons;
    var context = this;
    console.log( "Persons::" + context._id + "::remove::cancel" );
    parent._states = {view:context._id};
  }
  
});




//////////////////////////// CONTROLLER ////////////////////////////

Session.setDefault("personsStates","{}");
Persons.person._defaultState = "list";
Persons._multiPersonStates = ["select"];

Object.defineProperties(Persons, {
  
  _states: {
    
    get: function () {
      return EJSON.parse( Session.get("personsStates") );
    },
    
    set: function (update) {
      var self = Persons;
      var states = EJSON.parse( Session.get("personsStates") );
      
      // Get update object (usually only for iteration is made)
      for(var state in update) {
        
        // Id of the person to be updated
        var id = update[state];
        
        // Set default state for all other persons
        for( otherId in states ) {
          
          // The set person's state is NOT in the same state as this person, or this person is NOT in a multi-person state?
          if( state !== states[otherId] || ($.inArray( states[otherId] === -1), self._multiPersonStates ) ) {
            // Set to default state
            delete states[otherId];
          }
        }
        
        // Set default state for this person?
        if( state === self.person._defaultState ) {
          // Remove person
          delete states[id];
        }
        // Non-default state?
        else {
          // Save the new state
          states[id] = state;
        }
      }
      
      // Save in the session variable
      Session.set("personsStates", EJSON.stringify(states));
    }
  }
});

/*Persons.computation = Tracker.autorun(function() {
  //////// OWN VARIABLES
  //Object.defineProperties(Persons, {});
});
*/

//////// INTERFACE FOR OTHER ELEMENTS
// Function: get persons data
Persons.get = function (selector) {
  console.log("Persons::get");
  var self = Persons;
  
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
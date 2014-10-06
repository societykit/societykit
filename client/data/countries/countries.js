//////////////////////////// ELEMENT: COUNTRIES ////////////////////////////
/*
- An abstract class for handling any kinds of "countries".
- Includes functionalities for adding/elementing/deleting these countries
on the user interface.
*/
Countries = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Countries.Data = new Meteor.Collection("countries");
Meteor.subscribe("countries");

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE: COUNTRIES
Countries.template = Template.countries;

Countries.template.list = function() {
  return Countries.Data.find();
}
//Countries.template.helpers({});

//// TEMPLATE: COUNTRY
Countries.country = {};
Countries.country.template = Template.country;

// Function: get state
Countries.country._getState = function(_id) {
  var parent = Countries;
  
  var states = parent._states;
  var state = states[_id];
  if( typeof state === "undefined" ) {
    state = parent.country._defaultState;
  }
  
  return state;
}


Countries.country.template.isState = function(state) {
  var parent = Countries;
  var self = this;
  
  //console.log( "Countries::country::template::isState   " + this._id + ": " + state + "="+current+" > " + (state === current) );
  return (state === parent.country._getState(self._id));
}
//Countries.country.template.helpers({});


Countries.country.template.edit = Template.countryEdit;
Countries.country.template.edit.checked = function (field, value) {
  var parent = Countries;
  var tmpl = this;
  console.log( "Tmpl="+EJSON.stringify(tmpl) );
  
  if( tmpl[field] === value ) {
    return 'checked="checked" ';
  }
  else {
    return '';
  }
}
Countries.country.template.edit.selected = function (field, value) {
  var parent = Countries;
  var tmpl = this;
  console.log( "Tmpl="+EJSON.stringify(tmpl) );
  
  if( tmpl.selected === tmpl.value ) {
    return 'selected="selected" ';
  }
  else {
    return '';
  }
}

Countries.country.template.add = Template.countryAdd;
Countries.country.template.add.dropdownValues = function () {
  
  //var countries2 = Countries2.get();
  // TODO Selected - under if statement. Put the 'selected:"selected"' field only on the selected country.
  
  // TODO Check if the current value is invalid/outdated, inform this to the user on the screen
  
  return [{value:"id1",title:"DD1",selected:this.dropdown}, {value:"id2",title:"DD2",selected:this.dropdown}];
}
Countries.country.template.edit.dropdownValues = Countries.country.template.add.dropdownValues;






Countries.country.validate = function(data) {
  var isValid = true;
  var invalids = {};
  
  if( typeof data.name === "undefined" ) {
    invalids[data.name] = "Sorry, error on the website.";
    console.log("Countries::country::validate   Data: "+EJSON.stringify(data)+" -> name is missing." );
    isValid = false;
  }
  
  if( !data.name.length ) {
    invalids[data.name] = "Txt 1 must not be empty.";
    isValid = false;
  }
  // TODO: Unique name for txt 1?
  
  if( isValid ) {
    console.log( "Countries::country::validate   Data: "+EJSON.stringify(data)+" -> Valid!" );
    return false;
  }
  else {
    console.log( "Countries::country::validate   Data: "+EJSON.stringify(data)+" -> Invalid values: " + EJSON.stringify(invalids) );
    return invalids;
  }
}



//// EVENTS
Countries.template.events({
  
  // KEYBOARD NAVIGATION & MANIPULATION
  
  // TODO Use arrow keys, tab, enter and esc to navigate and edit countries
  
  
  // TODO Click outside everything --> remove listDetails
  
  
  // COUNTRY: ADD
  'click #countryAdd .add': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('#countryAdd').serializeArray(), function(){ form[this.name] = this.value; });
    
    console.log( "Form data = " + EJSON.stringify(form) );
    
    // Validations for form data
    var invalids = parent.country.validate(form);
    
    if( !invalids ) {
      parent.Data.insert(form,
        function(error) {
          if( !error ) {
            console.log("Countries::add   Added country " + EJSON.stringify( form ) );
            $('#countryAdd')[0].reset();
          }
          else {
            console.log("Countries::add   Error in adding country:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Countries::add   Not valid form data given." );
    }
    /*
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var coords = Session.get("createCoords");
    */
    
  },
  'click #countryAdd .cancel': function (evt, tmpl) {
    console.log("Countries::add   Reset form.");
    //$('.countryAdd')[0].reset();
    //return false;
  }
  // TODO: Automatic validations
});


Countries.country.template.events({
  
  // COUNTRY: LIST
  'click .countryList': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    console.log( "Countries::" + context._id + "::click.list" );
    
    // Show details on country
    parent._states = {listDetails:context._id};
  },
  
  // COUNTRY: SELECT
  'click .countrySelect': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    console.log( "Countries::" + context._id + "listDetails" );
    parent._states = {list:context._id};
  },
  
  // COUNTRY: LIST DETAILS
  'click .countryListDetails': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    console.log( "Countries::" + context._id + "::list" );
    parent._states = {list:context._id};
  },
  'click .countryListDetails .open': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    console.log( "Countries::" + context._id + "::open" );
    parent._states = {view:context._id};
    evt.stopImmediatePropagation();
  },
  
  // COUNTRY: VIEW
  
  'click .countryView .close': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    console.log( "Countries::" + context._id + "::close" );
    parent._states = {listDetails:context._id};
  },
  'click .countryView .edit': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    console.log( "Countries::" + context._id + "::edit" );
    parent._states = {edit:context._id};
  },
  'click .countryView .remove': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    console.log( "Countries::" + context._id + "::remove" );
    parent._states = {remove:context._id};
  },
  
  
  // COUNTRY: EDIT
  
  'click .countryEdit .edit': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    console.log( "Countries::" + context._id + "::edit::commit" );
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('.countryEdit').serializeArray(), function(){ form[this.name] = this.value; });
    
    // Validations for form data
    var invalids = parent.country.validate(form);
    
    if( !invalids ) {
      parent.Data.update({_id:context._id},{$set:form},{},
        function(error, affectedRowsCount) {
          if( !error ) {
            console.log("Countries::" + context._id + "edit   Edited country " + EJSON.stringify( form ) );
            parent._states = {view:context._id};
          }
          else {
            console.log("Countries::" + context._id + "edit   Error in editing country:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Countries::" + context._id + "edit   Not valid form data given." );
    }
  },
  'click .countryEdit .cancel': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    console.log( "Countries::" + context._id + "::edit::cancel" );
    parent._states = {view:context._id};
  },
  // TODO: Automatic validations
  
  
  // COUNTRY: REMOVE
  'click .countryRemove .remove': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    console.log( "Countries::" + context._id + "::remove::confirm" );
    
    evt.preventDefault();
    
    parent.Data.remove({_id:context._id},
      function(error) {
        if( !error ) {
          console.log("Countries::" + context._id + "remove   Removed country." );
          parent._states = {list:context._id};
        }
        else {
          console.log("Countries::" + context._id + "remove   Error in removing country:" + EJSON.stringify(error) );
        }
      }
    );
  },
  'click .countryRemove .cancel': function (evt, tmpl) {
    var parent = Countries;
    var context = this;
    console.log( "Countries::" + context._id + "::remove::cancel" );
    parent._states = {view:context._id};
  }
  
});




//////////////////////////// CONTROLLER ////////////////////////////

Session.setDefault("countriesStates","{}");
Countries.country._defaultState = "list";
Countries._multiCountryStates = ["select"];

Object.defineProperties(Countries, {
  
  _states: {
    
    get: function () {
      return EJSON.parse( Session.get("countriesStates") );
    },
    
    set: function (update) {
      var self = Countries;
      var states = EJSON.parse( Session.get("countriesStates") );
      
      // Get update object (usually only for iteration is made)
      for(var state in update) {
        
        // Id of the country to be updated
        var id = update[state];
        
        // Set default state for all other countries
        for( otherId in states ) {
          
          // The set country's state is NOT in the same state as this country, or this country is NOT in a multi-country state?
          if( state !== states[otherId] || ($.inArray( states[otherId] === -1), self._multiCountryStates ) ) {
            // Set to default state
            delete states[otherId];
          }
        }
        
        // Set default state for this country?
        if( state === self.country._defaultState ) {
          // Remove country
          delete states[id];
        }
        // Non-default state?
        else {
          // Save the new state
          states[id] = state;
        }
      }
      
      // Save in the session variable
      Session.set("countriesStates", EJSON.stringify(states));
    }
  }
});

/*Countries.computation = Tracker.autorun(function() {
  //////// OWN VARIABLES
  //Object.defineProperties(Countries, {});
});
*/

//////// INTERFACE FOR OTHER ELEMENTS
// Function: get countries data
Countries.get = function (selector) {
  console.log("Countries::get");
  var self = Countries;
  
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
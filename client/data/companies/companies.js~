//////////////////////////// ELEMENT: COMPANIES ////////////////////////////
/*
- An abstract class for handling any kinds of "companies".
- Includes functionalities for adding/elementing/deleting these companies
on the user interface.
*/
Companies = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Companies.Data = new Meteor.Collection("companies");
Meteor.subscribe("companies");

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE: COMPANIES
Companies.template = Template.companies;

Companies.template.list = function() {
  return Companies.Data.find();
}
//Companies.template.helpers({});

//// TEMPLATE: COMPANY
Companies.company = {};
Companies.company.template = Template.company;

// Function: get state
Companies.company._getState = function(_id) {
  var parent = Companies;
  
  var states = parent._states;
  var state = states[_id];
  if( typeof state === "undefined" ) {
    state = parent.company._defaultState;
  }
  
  return state;
}


Companies.company.template.isState = function(state) {
  var parent = Companies;
  var self = this;
  
  //console.log( "Companies::company::template::isState   " + this._id + ": " + state + "="+current+" > " + (state === current) );
  return (state === parent.company._getState(self._id));
}
//Companies.company.template.helpers({});


Companies.company.template.edit = Template.companyEdit;
Companies.company.template.edit.checked = function (field, value) {
  var parent = Companies;
  var tmpl = this;
  console.log( "Tmpl="+EJSON.stringify(tmpl) );
  
  if( tmpl[field] === value ) {
    return 'checked="checked" ';
  }
  else {
    return '';
  }
}
Companies.company.template.edit.selected = function (field, value) {
  var parent = Companies;
  var tmpl = this;
  console.log( "Tmpl="+EJSON.stringify(tmpl) );
  
  if( tmpl.selected === tmpl.value ) {
    return 'selected="selected" ';
  }
  else {
    return '';
  }
}

Companies.company.template.add = Template.companyAdd;
Companies.company.template.add.dropdownValues = function () {
  
  //var companies2 = Companies2.get();
  // TODO Selected - under if statement. Put the 'selected:"selected"' field only on the selected company.
  
  // TODO Check if the current value is invalid/outdated, inform this to the user on the screen
  
  return [{value:"id1",title:"DD1",selected:this.dropdown}, {value:"id2",title:"DD2",selected:this.dropdown}];
}
Companies.company.template.edit.dropdownValues = Companies.company.template.add.dropdownValues;






Companies.company.validate = function(data) {
  var isValid = true;
  var invalids = {};
  
  if( typeof data.name === "undefined" ) {
    invalids[data.name] = "Sorry, error on the website.";
    console.log("Companies::company::validate   Data: "+EJSON.stringify(data)+" -> name is missing." );
    isValid = false;
  }
  
  if( !data.name.length ) {
    invalids[data.name] = "Txt 1 must not be empty.";
    isValid = false;
  }
  // TODO: Unique name for txt 1?
  
  if( isValid ) {
    console.log( "Companies::company::validate   Data: "+EJSON.stringify(data)+" -> Valid!" );
    return false;
  }
  else {
    console.log( "Companies::company::validate   Data: "+EJSON.stringify(data)+" -> Invalid values: " + EJSON.stringify(invalids) );
    return invalids;
  }
}



//// EVENTS
Companies.template.events({
  
  // KEYBOARD NAVIGATION & MANIPULATION
  
  // TODO Use arrow keys, tab, enter and esc to navigate and edit companies
  
  
  // TODO Click outside everything --> remove listDetails
  
  
  // COMPANY: ADD
  'click #companyAdd .add': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('#companyAdd').serializeArray(), function(){ form[this.name] = this.value; });
    
    console.log( "Form data = " + EJSON.stringify(form) );
    
    // Validations for form data
    var invalids = parent.company.validate(form);
    
    if( !invalids ) {
      parent.Data.insert(form,
        function(error) {
          if( !error ) {
            console.log("Companies::add   Added company " + EJSON.stringify( form ) );
            $('#companyAdd')[0].reset();
          }
          else {
            console.log("Companies::add   Error in adding company:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Companies::add   Not valid form data given." );
    }
    /*
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var coords = Session.get("createCoords");
    */
    
  },
  'click #companyAdd .cancel': function (evt, tmpl) {
    console.log("Companies::add   Reset form.");
    //$('.companyAdd')[0].reset();
    //return false;
  }
  // TODO: Automatic validations
});


Companies.company.template.events({
  
  // COMPANY: LIST
  'click .companyList': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    console.log( "Companies::" + context._id + "::click.list" );
    
    // Show details on company
    parent._states = {listDetails:context._id};
  },
  
  // COMPANY: SELECT
  'click .companySelect': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    console.log( "Companies::" + context._id + "listDetails" );
    parent._states = {list:context._id};
  },
  
  // COMPANY: LIST DETAILS
  'click .companyListDetails': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    console.log( "Companies::" + context._id + "::list" );
    parent._states = {list:context._id};
  },
  'click .companyListDetails .open': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    console.log( "Companies::" + context._id + "::open" );
    parent._states = {view:context._id};
    evt.stopImmediatePropagation();
  },
  
  // COMPANY: VIEW
  
  'click .companyView .close': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    console.log( "Companies::" + context._id + "::close" );
    parent._states = {listDetails:context._id};
  },
  'click .companyView .edit': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    console.log( "Companies::" + context._id + "::edit" );
    parent._states = {edit:context._id};
  },
  'click .companyView .remove': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    console.log( "Companies::" + context._id + "::remove" );
    parent._states = {remove:context._id};
  },
  
  
  // COMPANY: EDIT
  
  'click .companyEdit .edit': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    console.log( "Companies::" + context._id + "::edit::commit" );
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('.companyEdit').serializeArray(), function(){ form[this.name] = this.value; });
    
    // Validations for form data
    var invalids = parent.company.validate(form);
    
    if( !invalids ) {
      parent.Data.update({_id:context._id},{$set:form},{},
        function(error, affectedRowsCount) {
          if( !error ) {
            console.log("Companies::" + context._id + "edit   Edited company " + EJSON.stringify( form ) );
            parent._states = {view:context._id};
          }
          else {
            console.log("Companies::" + context._id + "edit   Error in editing company:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Companies::" + context._id + "edit   Not valid form data given." );
    }
  },
  'click .companyEdit .cancel': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    console.log( "Companies::" + context._id + "::edit::cancel" );
    parent._states = {view:context._id};
  },
  // TODO: Automatic validations
  
  
  // COMPANY: REMOVE
  'click .companyRemove .remove': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    console.log( "Companies::" + context._id + "::remove::confirm" );
    
    evt.preventDefault();
    
    parent.Data.remove({_id:context._id},
      function(error) {
        if( !error ) {
          console.log("Companies::" + context._id + "remove   Removed company." );
          parent._states = {list:context._id};
        }
        else {
          console.log("Companies::" + context._id + "remove   Error in removing company:" + EJSON.stringify(error) );
        }
      }
    );
  },
  'click .companyRemove .cancel': function (evt, tmpl) {
    var parent = Companies;
    var context = this;
    console.log( "Companies::" + context._id + "::remove::cancel" );
    parent._states = {view:context._id};
  }
  
});




//////////////////////////// CONTROLLER ////////////////////////////

Session.setDefault("companiesStates","{}");
Companies.company._defaultState = "list";
Companies._multiCompanyStates = ["select"];

Object.defineProperties(Companies, {
  
  _states: {
    
    get: function () {
      return EJSON.parse( Session.get("companiesStates") );
    },
    
    set: function (update) {
      var self = Companies;
      var states = EJSON.parse( Session.get("companiesStates") );
      
      // Get update object (usually only for iteration is made)
      for(var state in update) {
        
        // Id of the company to be updated
        var id = update[state];
        
        // Set default state for all other companies
        for( otherId in states ) {
          
          // The set company's state is NOT in the same state as this company, or this company is NOT in a multi-company state?
          if( state !== states[otherId] || ($.inArray( states[otherId] === -1), self._multiCompanyStates ) ) {
            // Set to default state
            delete states[otherId];
          }
        }
        
        // Set default state for this company?
        if( state === self.company._defaultState ) {
          // Remove company
          delete states[id];
        }
        // Non-default state?
        else {
          // Save the new state
          states[id] = state;
        }
      }
      
      // Save in the session variable
      Session.set("companiesStates", EJSON.stringify(states));
    }
  }
});

/*Companies.computation = Tracker.autorun(function() {
  //////// OWN VARIABLES
  //Object.defineProperties(Companies, {});
});
*/

//////// INTERFACE FOR OTHER ELEMENTS
// Function: get companies data
Companies.get = function (selector) {
  console.log("Companies::get");
  var self = Companies;
  
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
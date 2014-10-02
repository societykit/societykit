//////////////////////////// ELEMENT: ITEMS ////////////////////////////
/*
- An abstract class for handling any kinds of "items".
- Includes functionalities for adding/elementing/deleting these items
on the user interface.
*/
Items = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Items.Data = new Meteor.Collection("items");
Meteor.subscribe("items");

//// INSERT INITIAL DATA
Meteor.startup(function(){});


//////////////////////////// VIEW ////////////////////////////

//// TEMPLATE: ITEMS
Items.template = Template.items;

Items.template.list = function() {
  var self = Items;
  return self.Data.find();
}
Items.template.helpers({});

/*Items.template.editing = function () {
  return SiteEditor.editing;
}*/
//Items.template.events({});


//// TEMPLATE: ITEM
Items.item = {};
Items.item.template = Template.item;

// Function: get state
Items.item._getState = function(_id) {
  var parent = Items;
  
  var states = parent._states;
  var state = states[_id];
  if( typeof state === "undefined" ) {
    state = parent.item._defaultState;
  }
  
  console.log( "Items::item::template::_getState   "+_id+":" + EJSON.stringify(state) );
  return state;
}


Items.item.template.isState = function(state) {
  var parent = Items;
  var self = this;
  
  //console.log( "Items::item::template::isState   " + this._id + ": " + state + "="+current+" > " + (state === current) );
  return (state === parent.item._getState(self._id));
}
//Items.item.template.helpers({});


Items.item.template.edit = Template.itemEdit;
Items.item.template.edit.checked = function (field, value) {
  var parent = Items;
  var tmpl = this;
  console.log( "Tmpl="+EJSON.stringify(tmpl) );
  
  if( tmpl[field] === value ) {
    return 'checked="checked" ';
  }
  else {
    return '';
  }
}
Items.item.template.edit.selected = function (field, value) {
  var parent = Items;
  var tmpl = this;
  console.log( "Tmpl="+EJSON.stringify(tmpl) );
  
  if( tmpl.selected === tmpl.value ) {
    return 'selected="selected" ';
  }
  else {
    return '';
  }
}

Items.item.template.add = Template.itemAdd;
Items.item.template.add.dropdownValues = function () {
  
  //var items2 = Items2.get();
  // TODO Selected - under if statement. Put the 'selected:"selected"' field only on the selected item.
  
  // TODO Check if the current value is invalid/outdated, inform this to the user on the screen
  
  return [{value:"id1",title:"DD1",selected:this.dropdown}, {value:"id2",title:"DD2",selected:this.dropdown}];
}
Items.item.template.edit.dropdownValues = Items.item.template.add.dropdownValues;






Items.item.validate = function(data) {
  var isValid = true;
  var invalids = {};
  
  if( typeof data.txt1 === "undefined" ) {
    invalids[data.txt1] = "Sorry, error on the website.";
    console.log("Items::item::validate   Data: "+EJSON.stringify(data)+" -> txt1 is missing." );
    isValid = false;
  }
  
  if( !data.txt1.length ) {
    invalids[data.txt1] = "Txt 1 must not be empty.";
    isValid = false;
  }
  // TODO: Unique name for txt 1?
  
  if( isValid ) {
    console.log( "Items::item::validate   Data: "+EJSON.stringify(data)+" -> Valid!" );
    return false;
  }
  else {
    console.log( "Items::item::validate   Data: "+EJSON.stringify(data)+" -> Invalid values: " + EJSON.stringify(invalids) );
    return invalids;
  }
}



//// EVENTS
Items.template.events({
  
  // KEYBOARD NAVIGATION & MANIPULATION
  
  // TODO Use arrow keys, tab, enter and esc to navigate and edit items
  
  
  // TODO Click outside everything --> remove listDetails
  
  
  // ITEM: ADD
  'click #itemAdd .add': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('#itemAdd').serializeArray(), function(){ form[this.name] = this.value; });
    
    console.log( "Form data = " + EJSON.stringify(form) );
    
    // Validations for form data
    var invalids = parent.item.validate(form);
    
    if( !invalids ) {
      parent.Data.insert(form,
        function(error) {
          if( !error ) {
            console.log("Items::add   Added item " + EJSON.stringify( form ) );
            $('#itemAdd')[0].reset();
          }
          else {
            console.log("Items::add   Error in adding item:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Items::add   Not valid form data given." );
    }
    /*
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var public = ! template.find(".private").checked;
    var coords = Session.get("createCoords");
    */
    
  },
  'click #itemAdd .cancel': function (evt, tmpl) {
    console.log("Items::add   Reset form.");
    //$('.itemAdd')[0].reset();
    //return false;
  }
  // TODO: Automatic validations
});


Items.item.template.events({
  
  // ITEM: LIST
  'click .itemList': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    console.log( "Items::" + context._id + "::click.list" );
    
    // Show details on item
    parent._states = {listDetails:context._id};
  },
  
  // ITEM: SELECT
  'click .itemSelect': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    console.log( "Items::" + context._id + "listDetails" );
    parent._states = {list:context._id};
  },
  
  // ITEM: LIST DETAILS
  'click .itemListDetails': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    console.log( "Items::" + context._id + "::list" );
    parent._states = {list:context._id};
  },
  'click .itemListDetails .open': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    console.log( "Items::" + context._id + "::open" );
    parent._states = {view:context._id};
    evt.stopImmediatePropagation();
  },
  
  // ITEM: VIEW
  
  'click .itemView .close': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    console.log( "Items::" + context._id + "::close" );
    parent._states = {listDetails:context._id};
  },
  'click .itemView .edit': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    console.log( "Items::" + context._id + "::edit" );
    parent._states = {edit:context._id};
  },
  'click .itemView .remove': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    console.log( "Items::" + context._id + "::remove" );
    parent._states = {remove:context._id};
  },
  
  
  // ITEM: EDIT
  
  'click .itemEdit .edit': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    console.log( "Items::" + context._id + "::edit::commit" );
    
    evt.preventDefault();
    
    // Get data
    var form = {};
    $.each($('.itemEdit').serializeArray(), function(){ form[this.name] = this.value; });
    
    // Validations for form data
    var invalids = parent.item.validate(form);
    
    if( !invalids ) {
      parent.Data.update({_id:context._id},{$set:form},{},
        function(error, affectedRowsCount) {
          if( !error ) {
            console.log("Items::" + context._id + "edit   Edited item " + EJSON.stringify( form ) );
            parent._states = {view:context._id};
          }
          else {
            console.log("Items::" + context._id + "edit   Error in editing item:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Items::" + context._id + "edit   Not valid form data given." );
    }
  },
  'click .itemEdit .cancel': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    console.log( "Items::" + context._id + "::edit::cancel" );
    parent._states = {view:context._id};
  },
  // TODO: Automatic validations
  
  
  // ITEM: REMOVE
  'click .itemRemove .remove': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    console.log( "Items::" + context._id + "::remove::confirm" );
    
    evt.preventDefault();
    
    parent.Data.remove({_id:context._id},
      function(error) {
        if( !error ) {
          console.log("Items::" + context._id + "remove   Removed item." );
          parent._states = {list:context._id};
        }
        else {
          console.log("Items::" + context._id + "remove   Error in removing item:" + EJSON.stringify(error) );
        }
      }
    );
  },
  'click .itemRemove .cancel': function (evt, tmpl) {
    var parent = Items;
    var context = this;
    console.log( "Items::" + context._id + "::remove::cancel" );
    parent._states = {view:context._id};
  }
  
});




//////////////////////////// CONTROLLER ////////////////////////////

Session.setDefault("itemsStates","{}");
Items.item._defaultState = "list";
Items._multiItemStates = ["select"];

Object.defineProperties(Items, {
  
  _states: {
    
    get: function () {
      return EJSON.parse( Session.get("itemsStates") );
    },
    
    set: function (update) {
      var self = Items;
      var states = EJSON.parse( Session.get("itemsStates") );
      
      // Get update object (usually only for iteration is made)
      for(var state in update) {
        
        // Id of the item to be updated
        var id = update[state];
        
        // Set default state for all other items
        for( otherId in states ) {
          
          // The set item's state is NOT in the same state as this item, or this item is NOT in a multi-item state?
          if( state !== states[otherId] || ($.inArray( states[otherId] === -1), self._multiItemStates ) ) {
            // Set to default state
            delete states[otherId];
          }
        }
        
        // Set default state for this item?
        if( state === self.item._defaultState ) {
          // Remove item
          delete states[id];
        }
        // Non-default state?
        else {
          // Save the new state
          states[id] = state;
        }
      }
      
      // Save in the session variable
      Session.set("itemsStates", EJSON.stringify(states));
      console.log( "Items::_states.set   " + EJSON.stringify(Session.get("itemsStates") ) );
    }
  }
});

/*Items.computation = Tracker.autorun(function() {
  //////// OWN VARIABLES
  //Object.defineProperties(Items, {});
});
*/

//////// INTERFACE FOR OTHER ELEMENTS
// Function: get items data
Items.get = function (selector) {
  console.log("Items::get");
  var self = Items;
  
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
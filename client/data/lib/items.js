//////////////// ELEMENT: ITEMS ////////////////
/*
An abstract class for handling any kinds of "items".

Includes generic functionalities for adding, editing, deleting etc.
these items.

The inheriting classes (people, companies, sources, etc.)
can either use the default functions or replace them by their
own functions.

The items:add form is automatically closed, if the page changes away from "data".

*/


Items = {};
Items.children = {};
Items.inherit = function (params) {
  var obj = {}; // Inherited object
  var helpers = {}; // Helpers to be added for the object at the end of this function

  // If params are not okay, return false
  if( typeof params !== "object" || typeof params.className !== "string" ) {
    return false;
  }

  // Main template
  if( typeof Template[params.className] !== "undefined" ) {
    obj.template = Template[params.className];
  }
  else {
    obj.template = Template.items;
  }
  helpers.className = params.className;
  obj.className = params.className;
  
   // itemName Property
  if( typeof params.itemName !== "undefined" ) {
    helpers.itemName = params.itemName;
  }
  else {
    helpers.itemName = "item";
  }

  // title
  if( typeof params.title !== "undefined" ) {
    helpers.title = params.title;
  }
  else {
    helpers.title = helpers.className.charAt(0).toUpperCase() + helpers.className.substring(1);
  }

  // Go through all the other templates to override if they exist
  var templates = ["item", "add", "list", "view", "edit", "quickView", "fullView", "editableView"];
  for( var i = 0; i < templates.length; i++ ) {
    // First letter as capital, eg. "item" -> "Item"
    var capitalFirst = templates[i].charAt(0).toUpperCase() + templates[i].substring(1);

    // If template exists (eg. "sourcesItem"), override the default template (eg. "itemsItem")
    if( typeof Template[ params.className + capitalFirst ] ) {
      obj.template[templates[i]] = Template[ params.className + capitalFirst ];
    }
    // Otherwise, use the default template
    else {
      obj.template[templates[i]] = Template[ "items" + capitalFirst ];
    }
  }

  // Create a database and subscribe
  obj.db = new Meteor.Collection( params.className );
  Meteor.subscribe( params.className, params.className );

  /*helpers.listItems = function(className) {
    return Items.children[className].db.find({});
  }*/
  // Default validation function: Everything is valid.
  helpers.validate = function(data) {
    return false;
  }

  // Add all the created helpers to the template
  obj.template.helpers(helpers);



  //// MODES OF ITEMS

  obj.template.item._defaultMode = "list";
  obj.template.item._multiItemModes = ["select"]; // Multiple items can be in these modes at the same time.
  
  // Save the object _modes as a JSON string to the Meteor's session variable 'sourcesModes'
  // Reactivity of Meteor would be lost if it was saved as an "object" type of variable.
  Session.setDefault( helpers.className + "Modes","{}"); // eg. "sourcesModes"
  Object.defineProperties(obj.template, {
    _modes: {

      get: function () {
        return EJSON.parse( Session.get( helpers.className + "Modes") );
      },
      
      set: function (newValue) {
        // Get the current modes of the items. Turn the JSON string into a javascript object
        var itemModes = EJSON.parse( Session.get( helpers.className + "Modes") );

        // Get newValue object (usually only one for iteration is made)
        for(var mode in newValue) {
          var id = newValue[mode]; // Id of the item to be updated

          // Set all other items to the default mode
          for( otherId in itemModes ) {
            // The set item's mode is NOT in the same mode as this source, or this item is NOT in a multi-item mode?
            if( mode !== itemModes[otherId] || ($.inArray( itemModes[otherId] === -1), obj.template.item._multiItemModes ) ) {
              // Set to default mode
              delete itemModes[otherId];
            }
          }

          // Set default mode for this item?
          if( mode === obj.template.item._defaultMode ) {
            // Remove item
            delete itemModes[id];
          }
          // Non-default mode?
          else {
            // Save the new mode
            itemModes[id] = mode;
          }
        }

        // Save the itemModes into the session variable to make it reactive via Meteor
        Session.set( helpers.className + "Modes", EJSON.stringify(itemModes));
      }
    }
  });
  
  obj.template.item.modeIs = function( className, isThisMode ) {
    var currentMode = Items.children[ className ].template._modes[this._id];
    if( typeof currentMode === "undefined" ) {
      currentMode = Items.children[ className ].template.item._defaultMode;
    }
    return (isThisMode === currentMode);
  }




  //// ADDING ITEMS

  // Connect to session variable to gain Meteor's reactivity:
  //  Sources.template.adding <--> Session("sourcesAdding")
  Session.setDefault( helpers.className + "Adding",false);
  Object.defineProperties( obj.template, {
    adding: {
      get: function () {
        return Session.get( helpers.className + "Adding");
      },
      set: function (update) {
        Session.set( helpers.className + "Adding", update);
      }
    }
  });


  /* Function: Items.template.editItem(evt, tmpl, itemsObject, formId)
  Operation: Adds an item for which the user has filled in a form
             or edits the details of a given item.
  Used by: obj, ...
  */
  obj.template.editItem = function (evt, tmpl, itemsObject, formId, addOrEdit, context) {

    // Get the data typed on the form fields
    var form = {};
    $.each($(formId).serializeArray(), function(){ form[this.name] = this.value; });
    //console.log( itemsObject.className+"::template.editItem, received data: " + EJSON.stringify(form) + " for the formId " + formId );

    // Validations for form data
    var invalids = itemsObject.template.validate(form);

    // No invalid fields?
    if( !invalids ) {

      if( addOrEdit === "add" ) {
        // Insert the item
        itemsObject.db.insert(form,
          function( error ) {
            if( !error ) {
              //console.log(itemsObject.className+"::template.editItem, added item " + EJSON.stringify( form ) );
              $(formId)[0].reset();
              // Close the add item prompt
              itemsObject.template.adding = false;
            }
            else {
              console.log(itemsObject.className+"::editItem, error in adding an item:" + EJSON.stringify(error) );
            }
          }
        );
      }
      else {
        itemsObject.db.update({_id:context._id},{$set:form},{},
          function(error, affectedRowsCount) {
            if( !error ) {
              Items._modes = {view:context._id};
            }
            else {
              console.log(itemsObject.className+"::editItem " + context._id + " Error in editing the item:" + EJSON.stringify(error) );
            }
          }
        );
      }
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( itemsObject.template.className+"::editItem, not valid form data given." );
    }
  }

  // Function: Items::removeItem(evt, tmpl, itemsObject, context)
  obj.template.removeItem = function (evt, tmpl, itemsObject, context) {
    itemsObject.db.remove({_id:context._id},
      function(error) {
        if( !error ) {
          itemsObject.template._modes = {list:context._id};
        }
        else {
          console.log("Items::" + context._id + "remove   Error in removing source:" + EJSON.stringify(error) );
        }
      }
    );
  }

  


  //// INTERFACE FOR OTHER ELEMENTS
  // Function: Get all data about the items, based on the given MongoDB selector
  obj.get = function (selector) {

    // TODO Some access control (to the server side)?
    if( typeof selector !== "object" ) {
      selector = {};
    }

    var data = obj.template.db.find(selector);
    return data;
  }


  //// CONNECT TO OTHER ELEMENTS
  Meteor.startup(function(){
    // Computation: Updates when the selected Page changes
    obj.computation = Tracker.autorun(function() {

      // Page changes away from "data"?
      if( Page.getPage() !== "data" ) {

        // Close all "adding" form elements when the user changes the page
        obj.template.adding = false;
      }
    });
  });



  //// EVENTS

  obj.template.events({

    // ITEM ADD PROMPT: Clicked the button "add new item"
    'click .itemsAddPrompt': function (evt, tmpl) {
      obj.template.adding = true;
    },
    
    // ITEM ADD / ADD: Clicked "Add" after filling out the create new item form
    'click .itemsAdd .add': function (evt, tmpl) {

      // Prevent the normal action of clicking the "submit" button of a form
      // (which is to upload the form contents and send a new HTML request)
      evt.preventDefault();
      
      // Insert the item into database
      obj.template.editItem(evt, tmpl, obj, '#'+obj.className+' .itemsAdd', "add", this);
    },

    // ITEM ADD CANCEL: Clicked "Cancel" when the user was adding a new item
    'click .itemsAdd .cancel': function (evt, tmpl) {
      // Close the adding form
      obj.template.adding = false;
    },

    // ITEM: LIST
    'click .itemsList': function (evt, tmpl) {
      // Show details on source
      obj.template._modes = {view:this._id};

      // TODO: Close the add item prompt? Or ask whether the user wants to save any changes?
      // itemsObject.template.adding = false;
    },

    // ITEM: VIEW
    'click .itemsView .edit': function (evt, tmpl) {
      obj.template._modes = {edit:this._id};
    },
    'click .itemsView .remove': function (evt, tmpl) {
      obj.template._modes = {remove:this._id};
    },
    'click .itemsView .close': function (evt, tmpl) {
      obj.template._modes = {list:this._id};
    },


    // ITEM: EDIT
    'click .itemsEdit .edit': function (evt, tmpl) {
      evt.preventDefault();

      // Insert the item into database
      obj.template.editItem(evt, tmpl, obj, '#'+obj.className+' .itemsEdit', "edit", this);

      // Change the mode
      obj.template._modes = {view:this._id};
    },
    'click .itemsEdit .cancel': function (evt, tmpl) {
      obj.template._modes = {view:this._id};
    },


    // ITEM REMOVE: Removes the item that is in a removing mode and the removal is confirmed
    'click .itemsRemove .remove': function (evt, tmpl) {
      var context = this;
      evt.preventDefault();
      obj.template._modes = {list:this._id};
      obj.template.removeItem(evt, tmpl, obj, this);
    },
    // Function: Cancel removing mode of an item
    'click .itemsRemove .cancel': function (evt, tmpl) {
      obj.template._modes = {view:this._id};
    }
    
  });
  
    // TODO: Automatic real-time validations while the user types in content -> inform the user
    // TODO KEYBOARD NAVIGATION & MANIPULATION
    // TODO Use arrow keys, tab, enter and esc to navigate and edit sources
    // TODO Click outside everything --> remove listDetails mode(?)



  // Add the inherited object to the Items' children collection
  Items.children[helpers.className] = obj;
  return obj;
}



//////////////// END OF FILE ////////////////
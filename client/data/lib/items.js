//////////////// ELEMENT: ITEMS ////////////////
/*
- An abstract class for handling any kinds of "items".
- Includes generic functionalities for adding/elementing/deleting these items
on the user interface, which actual item classes can inherit/copy.
*/
Items = {};

// View of the abstract Items class
//Items.template = Template.items;
//Items.item = {};
//Items.item.template = Template.item;


// Inherit the Items class
/*
// Example of parameters:
child = {
  objName: "sources",
  
  templates: {
    main: "sources",
    add: Template.sourcesItemAdd,
    view: Template.sourcesItemView,
    edit: Template.sourcesItemEdit,
    remove: Template.sourcesItemRemove,
    quickView: Template.sourcesItemQuick,
    fullView: Template.sourcesItemFull,
    editableView: Template.sourcesItemEditable
  },
  
  validate: function(data) { ... }
}
*/
Items.inherit = function (child) {
  
  // Return this object
  var obj = {};
  
  //////////////// MODEL ////////////////
  //// CREATE DATABASE COLLECTION
  obj.Data = new Meteor.Collection(child.objName);
  Meteor.subscribe(child.objName);

  //// INITIALIZE
  //Meteor.startup(function(){});

  //////////////// VIEW ////////////////
  // An Items class has multiple templates
  // Let's first save the templates that the child class implements itself
  obj.Templates = child.Templates;
  // TODO: Check that the templates are valid?
  
  // Inherit templates from the Items parent class if they were not given...
  
  //// TEMPLATE: ITEMS
  // Inherit the Main template if needed
  if( !obj.Templates.main ) {
    obj.Templates.main = Template.items;
    
    // Save the name of the object so it can be used in the templates
    obj.Templates.main.objName = child.objName;
    if( typeof obj.Templates.main.objName === "undefined" ) {
      obj.Templates.main.objName = "items";
      console.log( "Error! Creating an Items object without objName given. Try to go on with the name 'items'." );
    }
      
    // Title for the items view on the webpage
    obj.Templates.main.title = child.objName.charAt(0).toUpperCase() + child.objName.substring(1);
    
    // Function: Returns whether the user is currently adding a new item and the add form fields should thus be shown.
    obj.Templates.main.adding = function() {
      return obj._adding;
    }

    // Function: Lists all the sources in the database
    obj.Templates.main.listItems = function() {
      return obj.Data.find();
    }
  }
  
  
  // Inherit all other templates if needed: item, add, view, edit, remove, quickView, fullView, editableView
  if( !obj.Templates.item ) {
    obj.Templates.item = Template.item;
    
    // Function: return the name of the template to be shown for the item,
    // based on what its current mode is (view, edit, remove, etc.)
    obj.Templates.item.modeBasedTemplate = function(mode) {
      
      // Get mode of the item: list/view/edit/remove
      var mode = obj.item._getMode(this._id);
      
      // Return eg. "itemView"
      return obj.template.objName + "Item" + obj.item._getMode(this._id) + mode.charAt(0).toUpperCase() + mode.substring(1);
    }
  }
  if( !obj.Templates.add ) { obj.Templates.add = Template.itemsAdd; }
  if( !obj.Templates.view ) { obj.Templates.view = Template.itemsView; }
  if( !obj.Templates.edit ) { obj.Templates.edit = Template.itemsEdit; }
  if( !obj.Templates.remove ) { obj.Templates.remove = Template.itemsRemove; }
  if( !obj.Templates.quickView ) { obj.Templates.quickView = Template.itemsQuickView; }
  if( !obj.Templates.fullView ) { obj.Templates.remove = Template.itemsFullView; }
  if( !obj.Templates.editableView ) { obj.Templates.remove = Template.itemsEditableView; }
  
  // Item validation function given?
  if( typeof child.validate === "function" ) {
    obj.validate = child.validate;
  }
  // Otherwise use the empty default validation function
  else {
  // Default validation function: returns always FALSE ie. that all data is valid.
  obj.validate = function (data) {
    return false;
  }
  
  //// TEMPLATE: (A SINGLE) ITEM
  obj.item = {};
  
  // Function: get mode (= is the source item shown in the list, view, edit or remove mode)
  obj.item._getMode = function(_id) {
    var modes = obj._modes;
    var mode = modes[_id];
    if( typeof mode === "undefined" ) {
      mode = obj.item._defaultMode;
    }
    return mode;
  }
  
  
  //// EVENTS
  obj.Templates.main.events({
    
    // KEYBOARD NAVIGATION & MANIPULATION
    // TODO Use arrow keys, tab, enter and esc to navigate and edit sources
    
    // TODO Click outside everything --> remove listDetails
    
    // ITEM: ADD
    // Clicking the button "add new item"
    'click #itemsAddNew': function (evt, tmpl) {
      Items._adding = true;
    },
    // Clicked "Add" after filling out the form
    'click #itemsAdd .add': function (evt, tmpl) { 
      Items.add(evt, tmpl, Items, '#itemsAdd')
      
    },
    // Clicked "Cancel" when the user was adding a new item
    'click itemsAdd .cancel': function (evt, tmpl) {
      // Close the adding form
      Items.cancelAdding(Sources);
      Items._adding = false;
    }
    // TODO: Automatic real-time validations while the user types in content -> inform the user
  });
  obj.Templates.item.events({
    
    // ITEM: LIST
    'click .itemsList': function (evt, tmpl) {
      // Show details on source
      Items._modes = {view:this._id};
    },
    // ITEM: VIEW
    'click .itemsView .edit': function (evt, tmpl) {
      Items._modes = {edit:this._id};
    },
    'click .itemsView .remove': function (evt, tmpl) {
      Items._modes = {remove:this._id};
    },
    'click .itemsView .close': function (evt, tmpl) {
      Items._modes = {list:this._id};
    },
    
    // ITEM: EDIT
    'click .sourceEdit .edit': function (evt, tmpl) {
      var context = this;
      evt.preventDefault();
      
      // Get data
      var form = {};
      $.each($('.itemsEdit').serializeArray(), function(){ form[this.name] = this.value; });
      
      // Validations for form data
      var invalids = Items.validate(form);
      
      if( !invalids ) {
        Items.Data.update({_id:context._id},{$set:form},{},
          function(error, affectedRowsCount) {
            if( !error ) {
              console.log("Items::" + context._id + "edit   Edited source " + EJSON.stringify( form ) );
              Items._modes = {view:context._id};
            }
            else {
              console.log("Items::" + context._id + "edit   Error in editing the item:" + EJSON.stringify(error) );
            }
          }
        );
      }
      else {
        // TODO Show erronous fields from 'invalids' variable
        console.log( "Items::" + context._id + "edit   Not valid form data given." );
      }
    },
    'click .itemsEdit .cancel': function (evt, tmpl) {
      Items._modes = {view:context._id};
    },
    // TODO: Automatic real-time validations while the user types in content -> inform the user
    
    // ITEM: REMOVE
    // Function: Removes the item that is in a removing mode and the removal is confirmed
    'click .itemsRemove .remove': function (evt, tmpl) {
      var context = this;
      evt.preventDefault();
      
      parent.Data.remove({_id:context._id},
        function(error) {
          if( !error ) {
            Items._modes = {list:context._id};
          }
          else {
            console.log("Items::" + context._id + "remove   Error in removing source:" + EJSON.stringify(error) );
          }
        }
      );
    },
    // Function: Cancel removing mode of an item
    'click .itemsRemove .cancel': function (evt, tmpl) {
      Items._modes = {view:this._id};
    }
  });
  
  
  
  
  //////////////////////////// CONTROLLER ////////////////////////////
  
  // Private properties
  Session.setDefault("sourcesAdding",false);
  Session.setDefault("sourcesModes","{}");

  Sources._adding = false; // Is the user now adding a new item so that the form fields should be visible.
  Sources._multiSourceModes = ["select"];
  Sources.item._defaultMode = "list";

  Object.defineProperties(Sources, {
    _adding: {
      get: function () {
        return Session.get("sourcesAdding");
      },
      set: function (update) {
        Session.set("sourcesAdding", update);
      }
    },
    _modes: {
      // Save the object _modes as a JSON string to the Meteor's session variable 'sourcesModes'
      get: function () {
        return EJSON.parse( Session.get("sourcesModes") );
      },
      set: function (update) {
        var self = Sources;
        
        // Turn the JSON string into a javascript object
        var modes = EJSON.parse( Session.get("sourcesModes") );
        
        // Get update object (usually only for iteration is made)
        for(var mode in update) {
          
          // Id of the source to be updated
          var id = update[mode];
          
          // Set default mode for all other sources
          for( otherId in modes ) {
            
            // The set source's mode is NOT in the same mode as this source, or this source is NOT in a multi-source mode?
            if( mode !== modes[otherId] || ($.inArray( modes[otherId] === -1), self._multiSourceModes ) ) {
              // Set to default mode
              delete modes[otherId];
            }
          }
          
          // Set default mode for this source?
          if( mode === self.source._defaultMode ) {
            // Remove source
            delete modes[id];
          }
          // Non-default mode?
          else {
            // Save the new mode
            modes[id] = mode;
          }
        }
        
        // Save in the session variable
        Session.set("sourcesModes", EJSON.stringify(modes));
      }
    }
  });

  /*Sources.computation = Tracker.autorun(function() {
    //////// OWN VARIABLES
    //Object.defineProperties(Sources, {});
  });
  */

  //////// INTERFACE FOR OTHER ELEMENTS
  // Function: Get all data about sources, based on the given MongoDB selector
  Sources.get = function (selector) {
    console.log("Sources::get");
    var self = Sources;
    
    if( typeof selector !== "object" ) {
      selector = {};
    }
    
    var data = self.Data.find(selector);
    
    // TODO Some access control (to the server side)?
    
    return data;
  }




  //// CONNECT TO OTHER ELEMENTS
  Meteor.startup(function(){
    // Computation: Updates when the selected Page changes
    Sources.computation = Tracker.autorun(function() {
      
      // Page changes away from "Data"?
      if( Page.getPage() !== "data" ) {
        
        // Close all "adding" form elements
        Sources._adding = false;
      }
    });
  });

  
  // Function: Adds an item for which the user has filled in a form
  // Used by: Sources, ...
  Items.add = function (evt, tmpl, itemsObject, formId) {
    
    // Prevent the normal action of clicking the "submit" button of a form
    // (which is to upload the form contents and send a new HTML request)
    evt.preventDefault();
    
    // Get the data typed on the form fields
    var form = {};
    $.each($(formId).serializeArray(), function(){ form[this.name] = this.value; });
    console.log( "Form data = " + EJSON.stringify(form) + " for the formId " + formId );
    
    // Validations for form data
    var invalids = itemsObject.validate(form);
    
    // No invalid fields?
    if( !invalids ) {
      
      // Insert the item
      itemsObject.Data.insert(form,
        function(error) {
          if( !error ) {
            console.log("Items::add   Added item " + EJSON.stringify( form ) );
            $(formId)[0].reset();
          }
          else {
            console.log("Items::add   Error in adding an item:" + EJSON.stringify(error) );
          }
        }
      );
    }
    else {
      // TODO Show erronous fields from 'invalids' variable
      console.log( "Items::add   Not valid form data given." );
    }
  }

  //// EVENTS
  //Items.template.events({});



  //////////////// CONTROLLER ////////////////


  //// INTERFACE FOR OTHER ELEMENTS

  //// CONNECT TO OTHER ELEMENTS
  //Meteor.startup(function(){});


  // Object created, now return it.
  return obj;
}


//////////////// END OF FILE ////////////////
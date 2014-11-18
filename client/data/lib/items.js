//////////////// ELEMENT: ITEMS ////////////////
/*
An abstract class for handling any kinds of "items".

Includes:
- adding, editing, deleting items
- making connections to another items based class

The inheriting classes (people, companies, sources, etc.)
can either use the default functions or replace them by their
own functions.

The items:add form is automatically closed, if the page changes away from "data".

*/

Items = {};

/*All inheriting classes will be also saved in this variable, so that they
  can be more easily referenced to in the Items functions. Eg.
  Items.children = {
    companies: Companies,
    people: People
  }
*/
Items.children = {};


/*Function: ITEMS::INHERIT( PARAMS )
  Operation:  Inheriting classes (eg. Companies) call this function first in
              order to inherit the Items class.
  Parameters:
    params = {
      className: "examples"
      itemsTitle: "Best Examples" // Default value is "Examples" so it's not always necessary to define this
      itemName: "example"
      dropdowns: {
        exampleDropdownName: [
          { value: "exampleDbValueOption1", title: "Example Option 1" },
          { value: "exampleDbValueOption2", title: "Example Option 2" }
        ]
      },
      itemsConnections: {
        fieldNameInExamplesTemplate: { toClass: "examples2", field: "examples2fieldName" }
      }
    }
  
  Return value:
    If the inheritance succeeds, returns:
      The new inherited object. Eg. Sources = Items.inherit(...);
    If the inheritance fails, return:
      false
  Used by: All inheriting classes. Eg. Companies, Sources, Societies, Products...
*/
Items.inherit = function (params) {
  // Params is not an object or the className parameter is not a string?
  if( typeof params !== "object" || typeof params.className !== "string" ) { 
    // Can not create an items object with these params. The inheritance fails.
    return false;
  }
  
  // The inheriting object that will be returned from this function at the end
  var obj = {};
  
  // Helper functions and properties of the inheriting object are first
  // collected here. At the end, they will be actually added to
  // the object by calling the Meteor's default function: 
  // They will also be added to all the sub templates of the object, such as
  // itemsAdd, ItemsEdit, ItemsQuickView, etc.
  var helpers = {};
  
  // Now do many parts of the inheritance. If any function returns false,
  // the inheritance fails.
  
  // 1. HELPERS AND PROPERTIES
  // Set properties and create helper functions
  if( ! Items._setProperties(obj, params, helpers) ) { return false; }
  // Dropdowns
  if( ! Items._setDropdowns(obj, params, helpers) ) { return false; }
  // Connections to other items-based classes
  if( ! Items._setItemsConnections(obj, params, helpers) ) { return false; }

  // 2. DATA HANDLING
  // Database and data manipulation functions
  if( ! Items._setDataFunctions(obj, params, helpers) ) { return false; }
  
  
  // Now actually add all the helpers to the main template and sub templates
  if( ! Items._setHelpers(obj, params, helpers) ) { return false; }
  
  
  // 3. EVENTS HANDLING
  // Item modes, ie. different ways to show an item on screen
  if( ! Items._setItemModes(obj, params, helpers) ) { return false; }
  // Events handling
  if( ! Items._setEvents(obj, params, helpers) ) { return false; }
  
  // 4. INTERACTION BETWEEN ELEMENTS
  // Offer an interface for other elements
  if( ! Items._setPublicInterface(obj, params, helpers) ) { return false; }
  // Connect to interfaces of other elements
  if( ! Items._connectToOtherElements(obj, params, helpers) ) { return false; }
  
  // EVERYTHING IS READY!
  // The new items-based class has now been inherited! Add the inherited object
  // to the Items' children collection and return the object.
  Items.children[helpers.className] = obj;
  return obj;
}



// 1. HELPERS AND PROPERTIES

/*Function: ITEMS::_SETPROPERTIES( obj, params, helpers )
  Operation: Sets properties of the inheriting items object:
             template, className, itemName, itemsTitle, listItems, validate
  Params:
    obj: inheriting object
    params: parameters given for the inheritance
    helpers: List of helper functions that the caller later gives to the obj.
             This function may add properties to this object.
  Return value:
    If the properties can be set, returns: true
    If the properties can't be set (eg. bad params), returns: false
  Used by: Items::inherit
*/
Items._setProperties = function (obj, params, helpers) {
  
  // Main template: Define the main template of the inheriting class.
  // Does a template named by the inheriting class name exist?
  if( typeof Template[ params.className ] !== "undefined" ) {
    // Use that template
    obj.template = Template[ params.className ];
  }
  // Template not found by the class name?
  else {
    // Use the default items template
    obj.template = Template.items;
  }
  
  // className: Save the class name both for the inheriting object and to the
  // helpers of the templates of the object
  obj.className = params.className;
  helpers.className = params.className;
  
  // itemName
  // Is the itemName defined in the parameters? This string is used in the UI
  // in the "Create a new <itemName>" button's label
  if( typeof params.itemName !== "undefined" ) {
    helpers.itemName = params.itemName;
  }
  // ItemName not defined, so use a generic term "item"
  else {
    helpers.itemName = "item";
  }
  
  // itemsTitle: This is used in the UI to print a title on top of listing
  // all the items.
  if( typeof params.itemsTitle !== "undefined" ) {
    helpers.itemsTitle = params.itemsTitle;
  }
  // The default value (which often is used) is the class name where the first
  // letter is capitalized.
  else {
    helpers.itemsTitle = helpers.className.charAt(0).toUpperCase() 
      + helpers.className.substring(1);
  }
  
  // Helper to list all items on a template
  helpers.listItems = function(className) {
    return Items.children[className].db.find({}, Items.children[className].dbOptions );
  }
  
  // Default validation function: Everything is valid.
  helpers.validate = function(data) {
    return false;
  }
  
  // options for the function Db.find
  obj.dbOptions = {};
  
  // Set sorting order
  if( typeof params.sorting !== "undefined" ) {
    obj.dbOptions.sort = params.sorting;
  }
  else {
    obj.dbOptions.sort = [];
  }
  
  // All good.
  return true;
}


/*Function: ITEMS::_SETDROPDOWNS( obj, params, helpers )
  Operation: Set up dropdowns of the inheriting items object
  Params:
    obj: inheriting object
    params: parameters given for the inheritance
    helpers: List of helper functions that the caller later gives to the obj.
             This function may add properties to this object.
  Return value:
    If the dropdowns can be set, returns: true
    If the dropdowns can't be set (eg. bad params), returns: false
  Used by: Items::inherit
*/
Items._setDropdowns = function (obj, params, helpers) {
  
  /* Function: DROPDOWN( name )
  Operation: Returns the alternatives for the dropdown of the given name
  Used by: Templates of the inheriting items class
  */
  helpers.dropdown = function ( dropdownName, className ) {
    
    console.log( "Create dropdown: " + EJSON.stringify( Items.children[ className ].template.dropdowns[ dropdownName ] ) );
    
    return Items.children[ className ].template.dropdowns[ dropdownName ];
    
    //return this.dropdowns[ name ];
  }
  
  helpers.dropdownTitle = function( value, dropdownName, className ) {
    console.log("DropdownTitle!!!!! " );
    console.log( EJSON.stringify( Items.children[ className ].template.dropdowns ));
    console.log( "Params: " + value + ", " + dropdownName + ", " + className );
    console.log( EJSON.stringify(Object.keys(this)));
    console.log( EJSON.stringify(this));

    var title = $.grep(
      Items.children[ className ].template.dropdowns[ dropdownName ],
      function(dropdownItem) {
        return ( dropdownItem.value === value );
      });
    console.log( "Return Title=" + title );
    if( typeof title === "undefined" ) {
      return "";
    }
    else {
      return title;
    }
  }

  // Save the dropdowns to the template's data
  obj.template.dropdowns = params.dropdowns;
  helpers.dropdowns = params.dropdowns;
  
  return true;
}


/*Function: ITEMS::_SETITEMSCONNETIONS( obj, params, helpers )
  Operation: Set up items connections of the inheriting items object
  Params:
    obj: inheriting object
    params: parameters given for the inheritance
    helpers: List of helper functions that the caller later gives to the obj.
             This function may add properties to this object.
  Return value:
    If the items connections can be set, returns: true
    If the items connections can't be set (eg. bad params), returns: false
  Used by: Items::inherit
*/
Items._setItemsConnections = function (obj, params, helpers) {
  
  /*Function: ITEMS::CONNECTEDITEM
  
  */
  helpers.connectedItem = function( field, id, thisClass ) {
    //console.log( thisClass + "::connectedItem("+ field + ", " + id + ", " + thisClass + ")" );
    
    // No id exists?
    if( id === null || id === "" ) {
      //console.log("--Item's id is not defined. Return an empty string.");
      return "";
    }
    
    var connection = Items.children[ thisClass ].itemsConnections[ field ];
    var otherClass = Items.children[ connection.toClass ];
    //console.log("--Connect to: " + otherClass.className);
    //console.log( "--this.keys: " + EJSON.stringify(Object.keys(this)));
    
    // Create a selecting criteria for the db query
    var dbSelector = {_id: id };
    
    // Get only the one field of the other class item that is needed here
    var dbProjection = {};
    dbProjection[ connection.field ] = true;
    
    // Get the field contents from the other class
    var fieldContent = otherClass.get( dbSelector, 
      Items.children[ connection.toClass ], dbProjection, true );
    
    //console.log( "--received data: " + EJSON.stringify(fieldContent.fetch()) );
    
    //console.log("--return: " + fieldContent.fetch()[0][ connection.field ]);
    return fieldContent.fetch()[0][ connection.field ];
  }
  
  // Items connections for data fields that are connected to other items classes
  obj.itemsConnections = params.itemsConnections;
  if( typeof obj.itemsConnections !== "object" ) {
    obj.itemsConnections = {};
  }
  
  return true;
}


/*Function: ITEMS::_SETHELPERS( obj, params, helpers )
  Operation: Actually adds all the helpers to the obj object
  Params:
    obj: inheriting object
    params: parameters given for the inheritance
    helpers: List of helper functions to be added to the object.
  Return value:
    If the helpers can be set, returns: true
    If the helpers can't be set, returns: false
  Used by: Items::inherit
*/
Items._setHelpers = function (obj, params, helpers) {
  
  //console.log( obj.className + "::_setHelpers( <obj>, <params>, " + EJSON.stringify(helpers) );
  
  // Add all the created helpers to the template
  obj.template.helpers( helpers );
  
  // Sub templates
  var templates = 
    ["item", "add", "list", "view", "edit", "quickView", "fullView",
    "editableView"];
    
  // Go through all the sub templates to override if they exist
  for( var i = 0; i < templates.length; i++ ) {
    
    // First letter as capital, eg. "item" -> "Item"
    var capitalFirst = templates[i].charAt(0).toUpperCase() 
      + templates[i].substring(1);

    // If template exists (eg. "sourcesItem"), override the default template 
    // (eg. "itemsItem")
    if( typeof Template[ params.className + capitalFirst ] ) {
      obj.template[templates[i]] = Template[ params.className + capitalFirst ];
    }
    // Otherwise, use the default template
    else {
      obj.template[templates[i]] = Template[ "items" + capitalFirst ];
    }

    // Add the same helpers as the parent has
    obj.template[templates[i]].helpers(helpers);
  }
  
  // All went good
  return true;
}




// 2. DATA HANDLING

/*Function: ITEMS::_SETDATAFUNCTIONS( obj, params, helpers )
  Operation: Sets up database and functions to add, edit and remove data
  Params:
    obj: inheriting object
    params: parameters given for the inheritance
    helpers: helper functions and properties that have been added for the object
            TODO: Helpers parameter not needed?
  Return value:
    If the data functions setup was successful, returns: true
    If the setup was not successful, returns: false
  Used by: Items::inherit
*/
Items._setDataFunctions = function (obj, params, helpers) {
  
  // Database! Create a database and subscribe
  obj.db = new Meteor.Collection( params.className );
  Meteor.subscribe( params.className, params.className );
  

  // Connect to session variable to gain Meteor's reactivity:
  //  Sources.template.adding <--> Session("sourcesAdding")
  
  Session.setDefault( helpers.className + "Adding", false );
  Object.defineProperties( obj, {
    _adding: {
      get: function () {
        return Session.get( helpers.className + "Adding");
      },
      set: function (update) {
        Session.set( helpers.className + "Adding", update);
      }
    }
  });
  helpers.adding = function(className, trueOrNot) {
    // The parameter is given?
    if( typeof trueOrNot === "boolean" ) {
      Items.children[className]._adding = trueOrNot;
    }
    // Return the current value
    return Items.children[className]._adding;
  }
  
  
  
  /* Function: Items.template.editItem(evt, tmpl, itemsObject, formId)
  Operation: Adds an item for which the user has filled in a form
             or edits the details of a given item.
  Used by: obj, ...
  */
  obj.template.editItem = function (evt, tmpl, itemsObject, formId, addOrEdit, 
                                    context) {
    
    /*console.log(itemsObject.className + "::template::editItem(" + EJSON.stringify(
      Object.keys(evt)) + ", " + EJSON.stringify(Object.keys(tmpl)) + ", " + 
      itemsObject.className+"(object), " + formId + ", " + addOrEdit + ", " +
      EJSON.stringify(Object.keys(context)) + ")" );
    */
    // Get the data typed on the form fields
    var form = {};
    var otherItemsClasses = {};
    $.each(
      $(formId).serializeArray(),
      function(){
        
        // Connection to other class (if present)
        var connection = itemsObject.itemsConnections[ this.name ];
        
        // This a normal data field that is only related to this class?
        if( typeof connection === "undefined" ) {
          form[this.name] = this.value;
        }
        
        // This field is related to some other Items class?
        else {
         // console.log("--A field connected to other class: " + this.name );
          
          // Empty string?
          if( this.value === "" ) {
            //console.log("--An empty string. Save value as a null.");
            form[ this.name ] = null;
          }
          
          // Input is given?
          else {
            
            // The other class
            var otherClass = Items.children[ connection.toClass ];
            //console.log( "--the other class: " + otherClass.className );
            
            // Create the database selector, eg. {field: name}
            var dbSelector = {};
            dbSelector[ connection.field ] = this.value;
              
            // Search the other Items class's database for the user's input
            //console.log("--get the data from the other class...");
            var otherClassItem = otherClass.get( dbSelector, otherClass );
            //console.log("--...received the data from the other class: " + EJSON.stringify(otherClassItem.fetch() ) );
            
            // Other class item found?
            if( otherClassItem.count() !== 0 ) {
              // Change the returend cursor into the _id index of the item
              otherClassItem = otherClassItem.fetch()[0]._id;
            }
            
            // Other class item doesn't exist? Create a new item to the other class
            else {
              // TODO: Prompt for new details about creating the new item
              // (eg. show a popup for creating a company, on top of the
              // popup where the user is curretly creating a product?)
              
              //console.log("--No data was found, so let's insert the item to the other class...");
              
              // (For now) just insert a new item without any more specific details
              var otherClassItem = otherClass.insert( dbSelector, otherClass );
              //console.log("--...inserted the data to the other class.");
            }
            
            // If a proper connection item was found/created, then insert a field
            // for the connection
            if( otherClassItem ) {
              //console.log("--save the field '" + this.name + ": " + otherClassItem );
              form[ this.name ] = otherClassItem;
           
              // TODO: (should it work like this???)
              // If the data about the "other class item" was edited...
              
              // Is there a flag up (given in the sources.js, for example) that this class
              // should remove the other items if they dont have any more connections to anything
              // ??
           
              // Check whether this was the last item connected to that "other class item"
           
              // If so, then should we remove that "other class item"?
            }
            else {
              console.log("--No proper connection item was created! Save nothing for this field.");
            }
          }
        }
      }
    );
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
              itemsObject._adding = false;
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
          console.log("Items::" + context._id + "remove   Error in removing " +
            "source:" + EJSON.stringify(error) );
        }
      }
    );
  }
  
  return true;
}




// 3. EVENTS HANDLING

/*Function: ITEMS::_SETITEMMODES( obj, params, helpers )
  Operation: Sets up the functioning of the item modes
  Params:
    obj: inheriting object
    params: parameters given for the inheritance
    helpers: helper functions and properties that have been added for the object
            TODO: Helpers parameter not needed?
  Return value:
    If the item modes setup was successful, returns: true
    If the setup was not successful, returns: false
  Used by: Items::inherit
*/
Items._setItemModes = function (obj, params, helpers) {
  
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
  
  obj.template.item.helpers({ modeIs: function( className, isThisMode ) {
    var currentMode = Items.children[ className ].template._modes[this._id];
    if( typeof currentMode === "undefined" ) {
      currentMode = Items.children[ className ].template.item._defaultMode;
    }
    return (isThisMode === currentMode);
  } });
  
  return true;
}


/*Function: ITEMS::_SETEVENTS( obj, params, helpers )
  Operation: Sets events
  Params:
    obj: inheriting object
    params: parameters given for the inheritance
    helpers: helper functions and properties that have been added for the object
            TODO: Helpers parameter not needed?
  Return value:
    If the events setup was successful, returns: true
    If the setup was not successful, returns: false
  Used by: Items::inherit
*/
Items._setEvents = function (obj, params, helpers) {
  
  obj.template.events({

    // ITEM ADD PROMPT: Clicked the button "add new item"
    'click .itemsAddPrompt': function (evt, tmpl) {
      obj._adding = true;
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
      obj._adding = false;
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
  
  return true;
}







// 4. INTERACTION BETWEEN ELEMENTS

/*Function: ITEMS::_SETPUBLICINTERFACE( obj, params, helpers )
  Operation: Sets public interface functions to be used by other classes.
  Params:
    obj: inheriting object
    params: parameters given for the inheritance
    helpers: helper functions and properties that have been added for the object
            TODO: Helpers parameter not needed?
  Return value:
    If the interface setup was successful, returns: true
    If the setup was not successful, returns: false
  Used by: Items::inherit
*/
Items._setPublicInterface = function (obj, params, helpers) {
  
  
  // Function: Get all data about the items, based on the given MongoDB selector
  obj.get = function (selector, self, options /*, projection, findOne*/ ) {
    /*console.log( self.className + "::get(" + EJSON.stringify(selector) + ", " +
      self.className + "(object), " + EJSON.stringify(projection) + ", " +
      EJSON.stringify( findOne ) + ")" );
    */
    // TODO Some access control (to the server side)?
    
    // No selector given? Select all: {}.
    if( typeof selector !== "object" ) {
      selector = {};
    }
    if( typeof options !== "object" ) {
      options = {};
    }
    
    // Save data here
    var data = {};
    
    // Get the data
    data = self.db.find(selector, options);
    //console.log("--return data:" + EJSON.stringify(data.fetch()) );
    
    /*
    // No projection parameter given?
    if( typeof projection !== "object" ) {
      // Fetch all data by the selector
      
      if( findOne ) {
        data = self.db.findOne(selector);
      }
      else {
        data = self.db.find(selector);
      }
    }
    // Projection given?
    else {
      // Fetch only the requested fields
      
      if( findOne ) {
        data = self.db.findOne(selector, {fields: projection});
      }
      else {
        data = self.db.find(selector, {fields: projection});
      }
    }
    */
    
    return data;
  }
  
  /* Function: OBJ.INSERT
     Operation: another class can suggest inserting data to this Items object
     Parameters:
       selector: MongoDB selector
     Return value:
       if successfully inserted: _id of the inserted object
       if insertion failed: false
     Used by: Other Items classes
  */
  obj.insert = function (selector, self) {
    
    //console.log(self.className+"::insert(" + EJSON.stringify(selector) + ")" );
    
    // TODO Some access control (to the server side)?
    // Or suggest to the user to add more data to this item before it is
    // inserted?
    if( typeof selector !== "object" ) {
      return false;
    }
    
    // Insert the item
    var insertion = self.db.insert(selector);
    
    //console.log( "--insertion: " + EJSON.stringify(insertion) );
    
    // Successful insertion?
    if( insertion ) {
      // Return the _id of the inserted item
      return insertion;
    }
    // Unsuccesful?
    else {
      return false;
    }
  }
  

  return true;
}



/*Function: ITEMS::_CONNECTTOOTHERELEMENTS( obj, params, helpers )
  Operation: Connects this element to other elements (classes).
  Params:
    obj: inheriting object
    params: parameters given for the inheritance
    helpers: helper functions and properties that have been added for the object
            TODO: Helpers parameter not needed?
  Return value:
    If the interface setup was successful, returns: true
    If the setup was not successful, returns: false
  Used by: Items::inherit
*/
Items._connectToOtherElements = function (obj, params, helpers) {
  
  Meteor.startup(function(){
    // Computation: Updates when the selected Page changes
    obj.computation = Tracker.autorun(function() {

      // Page changes away from "data"?
      if( Page.getPage() !== "data" ) {

        // Close all "adding" form elements when the user changes the page
        obj._adding = false;
      }
    });
  });
  
  return true;
}


//////////////// END OF FILE ////////////////
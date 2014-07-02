//////////////////////////// ELEMENT: SITEEDITOR ////////////////////////////
// * * * CREATE OBJECT
SiteEditor = {};
console.log("SiteEditor::constructor   Object created.");


//////////////////////////// MODEL ////////////////////////////
/*

  _id               object id
  
  id                string (to be used in the code)
  title             string
  content           html / handlebars
  url               clean string
  
  
LATER:

  keywords        array = [string, string, ...]
  
  
  
CONTENT

  <h1>Title here</h1>
  <p>Paragraph goes here...</p>
  
  <img src="" relation="" />
  
  {{banner}}
  
  <p>
  Another paragraph...
  </p>
  
  
*/

// * * * DATABASE COLLECTION
//SiteEditor.data = new Meteor.Collection("siteEditor");
//Meteor.subscribe("siteEditor");


// * * * INITIALIZE
Meteor.startup(function(){
  
  // Nothing to do here at client.
  
});







//////////////////////////// VIEW ////////////////////////////

// * * * TEMPLATE
SiteEditor.template = Template.siteEditor;

SiteEditor.template.helpers({});


SiteEditor.template.rights = function () {
  var self = SiteEditor;
  
  // TODO Get current user's role
  var role = "admin";
  
  // Use my own access control list to define rights to edit
  return self._rigts[role];
  
}



// * * * EVENTS
SiteEditor.template.events({});










//////////////////////////// CONTROLLER ////////////////////////////


Session.setDefault("siteEditorEditing",false);
SiteEditor.computation = Deps.autorun(function() {
  
  
  // * * * OWN VARIABLES
  Object.defineProperties(SiteEditor, {
    
    editing: {
      get: function () {
        return Session.get("siteEditorEditing");
      },
      set: function (value) {
        
        if( value === true ) {
          // TODO Set body a class .editing
        }
        else {
          // TODO Remove class .editing from body
        }
        
        Session.set("siteEditorEditing", value);
        return true;
      }
    },
    
    
    _rights: {
      value: {
        
        "admin": true,
        "author": true,
        "user": false,
        "notlogged": false
        
      }
    }
    
  });
  
  
  
});






// * * * INTERFACE FOR OTHER ELEMENTS

//SiteEditor.fn = function () {...}








// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  
});






//////////////////////////// END OF FILE ////////////////////////////
/*





*/
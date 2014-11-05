//////////////////////// ELEMENT: PAGE ////////////////////////////
/*
The Page class is responsible for putting the contents of the
selected page onto the screen.

DATABASE FIELDS
  _id               object id
  id                string (to be used in the code)
  title             string
  content           html / handlebars
  url               clean string
(Later:)
  keywords        array = [string, string, ...]
  
CONTENT (database field)
  <h1>Title here</h1>
  <p>Paragraph goes here...</p>
  <img src="" relation="" />
  {{banner}}
  <p>Another paragraph...</p>
*/

Page = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Page.Pages = new Meteor.Collection("pages");

// Database data not received yet?
Page._loading = true;
Meteor.subscribe("pages", function() {
  Page._loading = false;
});

//// INITIALIZE
//Meteor.startup(function(){});

//////////////////////////// VIEW ////////////////////////////
//// TEMPLATE
Page.template = Template.page;

Page.template.helpers({
  // This function checks whether the given page is currently selected.
  isSelectedPage: function(page) {
    return ( page === Page._page );
  },

  // This function returns the title of the selected page to be
  // printed on the screen.
  title: function () {
    // Get the data of the selected page from database
    var pagedata = Page.Pages.findOne({id: Page._page});
    
    // Found data?
    if( pagedata ) {
      var title = pagedata.title;
    }
    
    // Data not found?
    else {
      // Still loading page database?
      if( Page._loading ) {
        var title= "Loading...";
      }
      // The page doesn't exist in the database
      else {
        var title = "Page not found";
      }
    }
    
    // Return the found title
    return title;
  }
});

/*
Page.template.content = function () {
  // Get that page data from database
  var pagedata = Page.Pages.findOne({id: Page._page});
  
  if( pagedata ) {
    var content = pagedata.content;
  }
  else {
    if( Page._loading ) {
      var content = "The page data is being loaded.";
    }
    else {
      var content = "Please check your address again.";
    }
  }
  
  // TODO Call other elements used inside the page
  //content = content.process;
  //content += Lang.template({id:123});
  //content = Template.lang({ id: 1500 });
  //for( Template.lang.find
  
  // Editing?
  if( SiteEditor.editing ) {
    content = Page.template._makeEditable(content);
  }
  
  // Return
  console.log ("Page::template::content '" + content + "'");
  return content;
}
*/

//// EVENTS
//Page.template.events({});
Handlebars.registerHelper('render', function(name, options) {
  if (Template[name])
    return new Handlebars.SafeString(Template[name]());
});


//////////////////////////// CONTROLLER ////////////////////////////
//// OWN VARIABLES

// The private property '_page' is here replicated/connected to the
// session variable 'pageCurrent', so that the _page variable becomes
// reactive. As a session variable, the 'pageCurrent' variable can
// be registered to the URL element at the end of this file. This
// means that the private property '_page', the session variable
// 'pageCurrent' and the browser's URL address are replicated to
// each other. (Besides that the URL address can also contain other
// strings of text that are related to other things than the current
// page.)
Session.setDefault("pageCurrent","home");
Object.defineProperties(Page, {
  _page: {
    get: function () {
      return Session.get("pageCurrent");
    },
    set: function (page) {
      return Session.set("pageCurrent", page);
    }
  }
});

//// INTERFACE FOR OTHER ELEMENTS
/*
Function: PAGE::GETPAGE()
Description: Tells on what page the user is currently.
Used by: Url, Navi
*/
Page.getPage = function () {
  return Page._page;
}

/*
Function: PAGE::SETPAGE()
Description: Changes the page on which the user is.
Used by: 
*/
Page.setPage = function (page) {
  console.log("Page::setPage: "+page);
  // TODO Check validity of the page (?)
  //this.setProperty("page", page);
  Page._page = page;
}

//// CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  Url.register("Page", "pageCurrent");
});

//////////////////////////// END OF FILE ////////////////////////////
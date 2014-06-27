//////////////////////////// ELEMENT: PAGE ////////////////////////////
// * * * CREATE OBJECT
Page = {};
console.log("Page::constructor   Object created.");


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

// Database data not received yet?
Page._loading = true;

Page.Pages = new Meteor.Collection("pages");
Meteor.subscribe("pages", function() {
  var self = Page;
  console.log( "Page::subscribe   Received: " + EJSON.stringify( Page.Pages.find().fetch() ) );
  self._loading = false;
});

// Modern way?
/*Object.defineProperty(Page, "Pages", {
  value: new Meteor.Collection("pages")
});*/

// * * * INITIALIZE
Meteor.startup(function(){
  
});





//////////////////////////// VIEW ////////////////////////////

// * * * TEMPLATE
Page.template = Template.page;
Page.template.helpers({});

Page.template.isCustomPage = function () {
  var self = Page;
  
  for( var i = 0; i < CustomPages.pages.length; i++ ) {
    if( self._page === CustomPages.pages[i] ) {
      return true;
    }
  }
  
  return false;
}
  

Page.template.content = function () {
  var self = Page;
  
  // Get that page data from database
  var pagedata = self.Pages.findOne({id: self._page});
  console.log("Page::template::title   Page="+self._page+", data="+EJSON.stringify(pagedata) );
  
  if( pagedata ) {
    var content = pagedata.content;
  }
  else {
    if( self._loading ) {
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
    content = self.template._makeEditable(content);
  }
  
  // Return
  console.log ("Page::template::content   Return content=" + content );
  return content;
}


Page.template.title = function () {
  var self = Page;
  
  // Get that page data from database
  var pagedata = self.Pages.findOne({id: self._page});
  console.log("Page::template::title   Page="+self._page+", data="+EJSON.stringify(pagedata) );
  
  if( pagedata ) {
    var title = pagedata.title;
  }
  else {
    if( self._loading ) {
      var title= "Loading...";
    }
    else {
      var title = "Page not found";
    }
  }
  
  // Editing?
  if( SiteEditor.editing ) {
    title = self.template._makeEditable(title);
  }
  
  // Return
  return title;
}


// * * * EVENTS
Page.template.events({});


Page.template._makeEditable = function(content) {
  // TODO For SiteEditor...
}




Handlebars.registerHelper('render', function(name, options) {
   if (Template[name])
     return new Handlebars.SafeString(Template[name]());
 });




//////////////////////////// CONTROLLER ////////////////////////////


// * * * OWN VARIABLES
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


  /*
 Page._page = Session.get("pageCurrent");
Page.computation = Deps.autorun(function() {
  var self = Page;
  self._page = Session.get("pageCurrent");
});

  */



// * * * INTERFACE FOR OTHER ELEMENTS

// Used by: Url, Navi
// Tells what page we're on right now!
Page.getPage = function () {
  var self = Page;
  console.log("Page::getPage   Return "+this._page);
  
  return self._page;
}

Page.setPage = function (page) {
  var self = Page;
  console.log("Page::setPage   "+page);
  // TODO Check validity of the page (?)
  
  //this.setProperty("page", page);
  self._page = page;
}

// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  console.log("Page::startup   Register current page as a URL variable");
  Url.register("Page", "pageCurrent");
});






//Object.seal(Page);

//////////////////////////// END OF FILE ////////////////////////////
/*



// Private functions
Template.page.helpers({
  
  pageContent: function () {
    
    // Get current page
    var page = State.get("page");
    
    // Print from database
    var current = Page.findOne({page: page});
    
    if( current ) {
      return current.content;
    }
    else {
      return "";
    }
  }
  
});

Template.page.change = function(page) {
  
  State.set("page",page);
  
}



Template.page.listenTextInput = function (inputCleaned) {
  
  var pages = Page.find();
  pages.forEach(function(page) {
    
    // Find a pure match to the url
    if( inputCleaned.text === page.url ) {
      
      console.log( "Found a pure match!" );
      
      // Change page now already
      Template.page.change(inputCleaned.text)
      
      
      // Inform the State
      var action = {
        action: "changePage",
        who: "page",
        parameters: [inputCleaned.text],
        certainty: 100,
        usedPart: inputCleaned.text,
        doneAlready: true,
        original: inputCleaned
      };
      State.suggestAction( action );
    }
    
  });
  console.log( "Hello there! No pure match was found! Should we go to an error page..?" );
  
  // No pure match 
  var action = {
    action: "pageNotFound",
    who: "page",
    parameters: [inputCleaned.text],
    certainty: 50,
    usedPart: "",
    doneAlready: false,
    original: inputCleaned
  };
  State.suggestAction( action );
  
}





Meteor.startup(function(){
  
  
  // Subscribe as State listener
  State.listen({
    listener: "page",
    what: "input",
    type: "text",
    priority: 1, // usually 1, 2 or 3
    fn: function (inputCleaned) {
      Template.page.listenTextInput(inputCleaned);
    }
  });
  
  
  
});
*/
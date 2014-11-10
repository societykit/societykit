//////////////////////////// ELEMENT: PAGE (SERVER) ////////////////////////////
/*
DATABASE FIELDS: PAGES
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

DATABASE FIELDS: PAGESTRUCTURES
  id              string
  structure:      [
    {
      id:           string
      children:     (structure)
    },
    ...
  ]

*/
Page = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTIONS
Page.Pages = new Meteor.Collection("pages");
Page.Structures = new Meteor.Collection("pageStructures");

//// INSERT INITIAL DATA
Meteor.startup(function () {
  // No pages?
  if( true ) { // !Page.Pages.findOne()
    Page.Pages.remove({});
    Page.Structures.remove({});
    

    Page.Pages.insert({
      id: "home",
      title: "Home",
      tooltip: "Home",
      txtcmd: ["home", ""]
    });
    
    /*Page.Pages.insert({
      id: "societies",
      title: "Societies",
      tooltip: "Societies",
      txtcmd: "societies"
    });*/
    
    Page.Pages.insert({
      id: "data",
      title: "Product Life-times",
      tooltip: "Product Life-times",
      txtcmd: "data"
    });
    
    /*Page.Pages.insert({
      id: "profile",
      title: "Profile",
      tooltip: "",
      txtcmd: "profile"
    });*/
    
    Page.Pages.insert({
      id: "about",
      title: "About",
      tooltip: "",
      txtcmd: "about"
    });
    
    
    Page.Structures.insert({
      // Default navi structure
      id: "default",
      structure: [
        { id: "home", children: [] },
        /*{ id: "societies", children: [] },*/
        { id: "data", children: [] },
        /*{ id: "profile", children: [] },*/
        { id: "about", children: [] }
      ]
    });
  }
});

////////////////////////// PRIVATE PROPERTIES //////////////////////////
// Page structure to be used if none is given as an argument for Page.getStructureAndData()
Page._defaultStructure = "default";


//////////////////////////// VIEW ////////////////////////////
//// SELECT
Meteor.publish("pages", function() {
  return Page.Pages.find();
});
Page.Pages.allow({
//// INSERT
insert: function() {
},
//// UPDATE
update: function() {
  
},
//// REMOVE
remove: function() {
}
});

/* TODO Publish also structure for the client?
Meteor.publish("structure", function() {
  return Page.data.find();
});

});
*/

//////////////////////////// CONTROLLER ////////////////////////////
//// INTERFACE FOR OTHER ELEMENTS
//Page.computation = Deps.autorun(function() {
// Used by: Navi
Page.getStructureAndData = function (structureId) {
  // Default structure
  if(typeof structureId === "undefined") {
    structureId = Page._defaultStructure;
  }
  
  // Get the structure. Take only first page structure that matches the structureId.
  var query = Page.Structures.findOne({id: structureId});
  if( typeof query === "undefined" || typeof query.structure === "undefined" ) {
    console.log( "Page::getStructureAndData   The given page structure id was not found. Return error value FALSE." );
    return false;
  }
  
  // Get page data and return the page structure appended with the data
  return Page._getStructureData(query.structure);
}
//});


// Recursive function for setting page title, page id and tooltip
// [{id, children: [...recursively...]}, ...]  ==>  [{id, title, tooltip, children: [...recursively...]} ]
Page._getStructureData = function(pageList) {
  // Go through every page on the list
  for( var i=0; i < pageList.length; i++ ) {
    // Set pageId, title, tooltip
    var page = Page.Pages.findOne({id: pageList[i].id}, {fields: {id:1, title:1, tooltip:1}});
    
    if( typeof page === "undefined" ) {
      console.log( "Page::getStructureData   Page "+pageList[i].id+" was not found. Skip it." );
      continue;
    }
    
    // Add title
    if( typeof page.title === "string" ) {
      pageList[i].title = page.title;
    }
    else {
      pageList[i].title = "("+page.id+")";
    }
    
    // Add tooltip
    if( typeof page.tooltip === "string" ) {
      pageList[i].tooltip = page.tooltip;
    }
    else {
      pageList[i].tooltip = "";
    }
    
    // Has child nodes?
    if( typeof pageList[i].children !== "undefined" ) {
      // Empty array?
      if( pageList[i].children.length === 0 ) {
        delete pageList[i].children;
      }
      else {
        // Go through children
        pageList[i].children = Page._getStructureData( pageList[i].children );
      }
    }
  }
  return pageList;
}

Page.structureChangeObservers = {};
Page.observeStructureChanges = function(structureId, callbacks, parameters) {
  // Invalid callbacks?
  if( typeof callbacks !== "object" && callbacks !== "stop" ) {
    console.log("Page::observeStructureChanges   Invalid callbacks:"+EJSON.stringify(callbacks)+", return FALSE.");
    return false;
  }
  
  // Already observing?
  if( typeof Page.structureChangeObservers[structureId] !== "undefined" ) {
    // Stop observing
    console.log( "Page::observeStructureChanges   Stop and remove observers of " + structureId );
    Page.structureChangeObservers[structureId].stop();
    delete Page.structureChangeObservers[structureId];
  }
  
  // Start observing?
  if( callbacks !== "stop" ) {
    console.log( "Page::observeStructureChanges   Restart observing " + structureId );
    Page.structureChangeObservers[structureId] = Page.Structures.find({id:structureId}).observe(callbacks);
  }
  
  return true;
}
Page.getPageStructureChanges = function (structureId) {
  return Page.Structures.find({id:structureId});
}

//// CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  // Go through all pages
  var pages = Page.Pages.find().fetch();
  for( var i = 0; i < pages.length; i++ ) {
    // Add txtcmd
    Txtcmd.set({
      who: "Page", // TODO send as a reference object? --> who: Page,
      texts: pages[i].txtcmd,
      action: "Page.setPage('"+pages[i].id+"');"
    });
     
    /*
      params: {
        id: 
      }
    */ 
  }
});

//////////////////////////// END OF FILE ////////////////////////////
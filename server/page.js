//////////////////////////// SERVER ////////////////////////////
//////////////////////////// ELEMENT: PAGE ////////////////////////////
// * * * CREATE OBJECT
Page = {};
console.log("Page::constructor   Object created.");



//////////////////////////// MODEL ////////////////////////////
/*

Pages:
  _id             object id
  id              string
  title           string
  tooltip         string
  content         html / handlebars
  txtcmd          clean string

LATER:
  keywords        array = [string, string, ...]
  
  
PageStructures:
  id              string
  structure:      [
    {
      id:           string
      children:     (structure)
    },
    ...
  ]

*/

// * * * DATABASE COLLECTIONS
Page.Pages = new Meteor.Collection("pages");
Page.Structures = new Meteor.Collection("pageStructures");


// * * * INITIALIZE
Meteor.startup(function () {
  
  // No pages?
  if( true ) { // !Page.Pages.findOne()
    Page.Pages.remove({});
    Page.Structures.remove({});
    

    Page.Pages.insert({
      id: "home",
      title: "Home",
      tooltip: "Home",
      content: "Global Place, World Societies, Global Societies",
      txtcmd: ["home", ""]
    });
    
    Page.Pages.insert({
      id: "market",
      title: "Market",
      tooltip: "Market",
      content: "",
      txtcmd: "market"
    });
    
    Page.Pages.insert({
      id: "budgets",
      title: "Budgets",
      tooltip: "Budgets",
      content: "Budgets: how much is availabe; how much each of us deserves ",
      txtcmd: "budgets"
    });
    
    Page.Pages.insert({
      id: "entities",
      title: "Entities",
      tooltip: "",
      content: "Explore companies, countries, organizations and individuals. Find out about their deeds, decisions, values and property. ",
      txtcmd: "entities"
    });
    
    Page.Pages.insert({
      id: "decisions",
      title: "Decisions",
      tooltip: "",
      content: "Decision making: Politicians' and other people's opinions, votes, decisions ",
      txtcmd: "decisions"
    });
    
    Page.Pages.insert({
      id: "data",
      title: "Data",
      tooltip: "",
      content: "",
      txtcmd: "data"
    });
    
    Page.Pages.insert({
      id: "economies",
      title: "Economies",
      tooltip: "",
      content: "Choose the economic system you want to live by: - Free market economy - Socialism - Global socialism - Free market Tampere - Closed circle for Jesuites",
      txtcmd: "economies"
    });
    
    Page.Pages.insert({
      id: "profile",
      title: "Profile",
      tooltip: "",
      content: "Name, address, etc.",
      txtcmd: "profile"
    });
    
    Page.Pages.insert({
      id: "help",
      title: "Help",
      tooltip: "",
      content: "Help...",
      txtcmd: "help"
    });
    
    
    
    Page.Structures.insert({
      // Default navi structure
      id: "default",
      structure: [
        { id: "home", children: [] },
        { id: "market", children: [] },
        { id: "budgets", children: [] },
        { id: "entities", children: [] },
        { id: "decisions", children: [] },
        { id: "data", children: [] },
        { id: "economies", children: [] },
        { id: "profile", children: [] },
        { id: "help", children: [] }
      ]
    });
  }
});

//////////////////////////// PROPERTIES ////////////////////////////
// Page structure to be used if none is given as an argument for Page.getStructureAndData()
Page._defaultStructure = "default";



//////////////////////////// VIEW ////////////////////////////
// * * * SELECT
Meteor.publish("pages", function() {
  return Page.Pages.find();
});
Page.Pages.allow({
// * * * INSERT
insert: function() {
},
// * * * UPDATE
update: function() {
  
},
// * * * REMOVE
remove: function() {
}
});


/* TODO Publish also structure for the client?
 * 
Meteor.publish("structure", function() {
  return Page.data.find();
});

});
*/



//////////////////////////// CONTROLLER ////////////////////////////
// * * * INTERFACE FOR OTHER ELEMENTS
//Page.computation = Deps.autorun(function() {
// Used by: Navi
Page.getStructureAndData = function (structureId) {
  console.log( "Page::getStructureAndData    id="+EJSON.stringify(structureId) );
  var self = Page;
  
  // Default structure
  if(typeof structureId === "undefined") {
    structureId = self._defaultStructure;
  }
  
  // Get the structure. Take only first page structure that matches the structureId.
  var query = self.Structures.findOne({id: structureId});
  if( typeof query === "undefined" || typeof query.structure === "undefined" ) {
    console.log( "Page::getStructureAndData   The given page structure id was not found. Return error value FALSE." );
    return false;
  }
  
  // Get page data and return the page structure appended with the data
  return self._getStructureData(query.structure);
}
//});


// Recursive function for setting page title, page id and tooltip
// [{id, children: [...recursively...]}, ...]  ==>  [{id, title, tooltip, children: [...recursively...]} ]
Page._getStructureData = function(pageList) {
  console.log( "Page::getStructureData   pageList=" + EJSON.stringify(pageList) );
  var self = Page;
  
  // Go through every page on the list
  for( var i=0; i < pageList.length; i++ ) {
    // Set pageId, title, tooltip
    var page = self.Pages.findOne({id: pageList[i].id}, {fields: {id:1, title:1, tooltip:1}});
    
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
        console.log( "Page::getStructureData   "+pageList[i].id + ": go through children." );
        pageList[i].children = self._getStructureData( pageList[i].children );
      }
    }
  }
  return pageList;
}





Page.structureChangeObservers = {};
Page.observeStructureChanges = function(structureId, callbacks, parameters) {
  console.log("Page::observeStructureChanges   structureId="+structureId);
  var self = Page;
  
  // Invalid callbacks?
  if( typeof callbacks !== "object" && callbacks !== "stop" ) {
    console.log("Page::observeStructureChanges   Invalid callbacks:"+EJSON.stringify(callbacks)+", return FALSE.");
    return false;
  }
  
  // Already observing?
  if( typeof self.structureChangeObservers[structureId] !== "undefined" ) {
    // Stop observing
    console.log( "Page::observeStructureChanges   Stop and remove observers of " + structureId );
    self.structureChangeObservers[structureId].stop();
    delete self.structureChangeObservers[structureId];
  }
  
  // Start observing?
  if( callbacks !== "stop" ) {
    console.log( "Page::observeStructureChanges   Restart observing " + structureId );
    self.structureChangeObservers[structureId] = self.Structures.find({id:structureId}).observe(callbacks);
  }
  
  return true;
}
Page.getPageStructureChanges = function (structureId) {
  console.log("Page::getPageStructureChanges   structureId="+structureId );
  var self = Page;
  return self.Structures.find({id:structureId});
}






// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  var self = Page;
  
  // Go through all pages
  var pages = self.Pages.find().fetch();
  for( var i = 0; i < pages.length; i++ ) {
    console.log("Page::startup   Add text command for page '" + pages[i].id + "'");
    
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



// No changes to the object's structure anymore
//Object.seal( Page );

//////////////////////////// END OF FILE ////////////////////////////
/*



/*
  self.Structures.find({id:structureId}).observe(callbackWrapper);
  
  // Get item
  var current = self.structureChangeObservers[ structureId ];
  
  // Invalid event?
  if( typeof event !== "string" ) {
    console.log("Page::observeStructureChanges   Parameter 'event' is not a string but a "
      +(typeof event)+". Return error value FALSE.");
    return false;
  }
  
  // What event to observe
  switch( event ) {
    // Stop listening?
    case "stop": 
      // Found the item?
      if( typeof current !== "undefined" ) {
        
        // Stop event listeners
        self.structureChangeObservers[ structureId ].handles... // TODO
        
        // Remove the callback group
        console.log("Page::observeStructureChanges   Remove all callbacks from "+structureId+".");
        delete self.structureChangeCallbacks[ structureId ];
      }
      // All good.
      return true;
    break;
    
    case "added":
    case "changed":
    case "removed":
      // Callback group for this structureId doesn't exist?
      if( typeof current === "undefined" ) {
        // Create the item
        self.structureChangeCallbacks[ structureId ] = {};
        console.log("Page::observeStructureChanges   Create the callback group for " + structureId );
      }
      
      // Callback exists?
      if( typeof self.structureChangeCallbacks[ structureId ][ event ] !== "undefined" ) {
        
        // Stop listening
        
      }
      
      // TODO Check that the function is OK ?
      
      // Add/overwrite the callback
      self.structureChangeCallbacks[ structureId ][ event ] = callback;
      console.log("Page::observeStructureChanges   Add/overwrite the callback function for event " + event );
      
      // Start listening
      var callbackWrapper = {};
      callbackWrapper[ event ] = function(){
        var self = Page;
        self.structureChangeCallbacks[structureId][event]();
      };
      var handle = self.Structures.find({id:structureId}).observe(callbackWrapper);
      self.structureChangeObservers
      
      // All good.
      return true;
    break;
    
    // Invalid event:
    default:
      console.log("Page::observeStructureChanges   Invalid event type: " + EJSON.stringify( event ) );
      return false;
    break;
  }
  
}





function( pageStructureId, naviId, publisher, naviSelf, callbacks ) {
  var self = Page;
  
  return self.Structures.find({ id: pageStructureId }).observe({
    added: function(newDoc) {
      callbacks.added (naviId, publisher, naviSelf, newDoc);
    },
    
    changed: function(newDoc, oldDoc) {
      callbacks.changed(naviId, publisher, naviSelf, newDoc, oldDoc);
    },
    
    removed: function(oldDoc) {
      callbacks.removed(naviId, publisher, naviSelf, oldDoc);
    }
  });
}
*/



/*
*/
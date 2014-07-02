//////////////////////////// SERVER ////////////////////////////
//////////////////////////// ELEMENT: NAVI ////////////////////////////
// * * * CREATE OBJECT
Navi = {};
console.log("Navi::constructor   Object created.");



//////////////////////////// MODEL ////////////////////////////
// * * * DATABASE COLLECTION
Navi.Navis = new Meteor.Collection("navis");

// * * * INITIALIZE
Meteor.startup(function () {
  Navi.Navis.remove({});
  Navi.Navis.insert({
    id: "default",
    pageStructureId: "default",
    pages: [],
    before: [
    ],
    after: [
    ]
  });
});



//////////////////////////// PROPERTIES ////////////////////////////
// Navi to be used if the client doesn't request any specific navi
Navi._default = "default";

// Handles of Page structure observers
Navi._pageStructureObservers = [];



//////////////////////////// VIEW ////////////////////////////
// * * * SELECT
/*
Function: NAVI::PUBLISH("NAVISTRUCTURES")
Operation: Provides the navi content of all the desired navis
Parameters:
  ids: array<string> (string = id of a navi)

Used by:
  Client::navi
  
Uses:
  Txtcmd (?)

Version history:
  01.12.13 Panu
    Changed from subscribing to multiple navis to subscribing only to a single navi.
    Parameter name changed from navis to navi.
  06.12.13 Panu
    No updates here from pageStructure. They are done all the time by observers that are set up in the start-up.
    
*/
Meteor.publish("navis", function( ids ) {
  console.log( "Navi::publish   ids=" + EJSON.stringify(ids) );
  var self = Navi;
  
  // Default value for ids needed?
  if( typeof ids === "undefined" ) {
    ids = [self._default];
    console.log( "Navi::publish   Set default value for ids: " + EJSON.stringify(ids) );
  }
  // Navi ids not an array? Put in an array.
  else if( !Array.isArray( ids ) ) {
    ids = [ids];
  }
  
  // Collect the ids of returnable navis here. Use the form [{id:<navi id>}, {...}, ...]
  var returnableNavis = [];
  
  // Update and start observing all requested navis:
  for( var i = 0; i < ids.length; i++ ) {
    
    // Navi id not a string?
    if( typeof ids[i] !== "string" ) {
      console.log("Navi::publish   Error: id is not a string: " + EJSON.stringify(ids[i]) );
      continue;
    }
    
    // Find the navi
    var navi = self.Navis.findOne({id:ids[i]});
    if( !navi ) {
      console.log("Navi::publish   Navi not found: " + ids[i] + ", skip it." );
      continue;
    }
    
    // Add navi to the returnable navis
    returnableNavis.push({id: ids[i]});
  }
  
  // Return a cursor for all returnable navis
  console.log( "Navi::publish   Return: " + EJSON.stringify( returnableNavis ) );
  return self.Navis.find({$or:returnableNavis});
});




Navi.Navis.allow({
// * * * INSERT
insert: function() {
  // TODO Only with admin rights
  // this.userId;
  return true;
},
  
// * * * UPDATE
update: function() {
  // TODO Only with admin rights
  return true;
},

// * * * REMOVE
remove: function() {
  // TODO Only with admin rights
  return true;
}
});



//////////////////////////// CONTROLLER ////////////////////////////
// * * * INTERFACE FOR OTHER ELEMENTS
Navi.fn = function () {
}

// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  var self = Navi;
  
  //Txtcmd.set([]);
  
  
  
  
  // Add observers for all page structures that are used by some navi
  
  // Go through all navis
  var navis = self.Navis.find().fetch();
  for( var i = 0; i < navis.length; i++ ) {
    
    // Navi has a page structure?
    if( typeof navis[i].pageStructureId !== "undefined" ) {
      
      // Start observing changes in Page's structures
      console.log( "Navi::CONNECT::Page   Start observing changes in page structure '"+navis[i].pageStructureId
        +"' for navi '"+navis[i].id+"'" );
      
      self._pageStructureObservers[navis[i].id]
        = Page.getPageStructureChanges( navis[i].pageStructureId ).observe({
          
        added: function (newDoc) {
          console.log( "Navi::CONNECT::Page::added   newDoc=" + EJSON.stringify(newDoc) );
          self._update(navis[0].id);
          console.log( "Navi::CONNECT::Page::added   Navi structure updated." );
        },
        updated: function (newDoc, oldDoc) {
          console.log( "Navi::CONNECT::Page::updated   newDoc=" + EJSON.stringify(newDoc) );
          self._update(navis[0].id);
          console.log( "Navi::CONNECT::Page::updated   Navi structure updated." );
        },
        removed: function (oldDoc) {
          console.log( "Navi::CONNECT::Page::removed  oldDoc=" + EJSON.stringify(oldDoc) );
          self._update(navis[0].id);
          console.log( "Navi::CONNECT::Page::removed   Navi structure updated." );
        },
      });
    }
  }
  
  
});




/* 
Function: NAVI::_UPDATE
Operation: Updates the given navi's structure based on the information from Page object
Parameters:
  id: id of the navi 

Return value:
  false: Error in updating the navi.

Used by:
  Navi::publish("naviStructures")
Uses:
  
Version history:
  02.12.2013 Panu
    Changed function name to Navi._update
*/
Navi._update = function (id) {
  console.log( "Navi::_update   id=" + EJSON.stringify(id) );
  self = Navi;
  
  // Not a string?
  if( typeof id !== "string" ) {
    console.log( "Navi::_update   The requested navi id is not a string, but a : " 
      + typeof id + ". Return error value FALSE." );
    return false;
  }
  
  // Get navi structure
  var navi = self.Navis.findOne({id:id});
  
  // Not found?
  if( !navi ) {
    console.log( "Navi::_update   Navi id not found: " + id + ". Return error value FALSE." );
    return false;
  }
  
  // Doesn't include a page structure?
  if( ! navi.pageStructureId || typeof navi.pageStructureId !== "string" ) {
    // No page structure to update. So the update is "successful". Return true.
    console.log( "Navi::_update   No page structure is used in the navi structure. So the update is 'successful'. Return true. " );
    return true;
  }
  
  // Get page structure
  var pageStructure = Page.getStructureAndData( navi.pageStructureId ); // --> [{_id, id, title, tooltip, children: [...recursively...]} ]
  console.log( "Navi::_update   Received page structure." );
    
  // Convert to navi structure = insert action scripts in place of the page id's
  var pages = self._addActionsToPageStructure(pageStructure); // TODO Is this really the best format for navi structure?
  
  // Error in creating navi structure?
  if( pages === false ) {
    // Don't use this navi, just in case...
    console.log( "Navi::_update   Error in creating navi structure out of the page structure. Return error value FALSE." );
    return false;
  }
  
  // Update the navi with new pages
  console.log( "Navi::_update   Update the '"+id+"' navi's pages with: " + EJSON.stringify(pages) );
  var dbSuccess = self.Navis.update({_id:navi._id},{$set:{pages:pages}});
  if( dbSuccess ) {
    console.log( "Navi::_update   Updated page structure. Return TRUE." );
    return true;
  }
  else {
    console.log( "Navi::_update   Updating unsuccessful. Return error value FALSE." );
    return false;
  }
}

/*
Function: NAVI::_ADDACTIONSTOPAGESTRUCTURE
Operation: Recursive function for setting page structure to navi structure
            = changing its pageId into an action in the form of a script string
Parameters:
  pageStructure

Used by:
  Navi::_updatePageStructure
Uses:
Version history:
  02.12.13 Panu
    Put the function under Navi.
    Renamed the function.
*/
Navi._addActionsToPageStructure = function(pageStructure) {
  console.log("Navi::_addActionsToPageStructure   pageStructure=" + EJSON.stringify(pageStructure) );
  var self = Navi;
  
  // Not an array?
  if( !Array.isArray(pageStructure) ) {
    console.log( "Navi::_addActionsToPageStructure   pageStructure is not an array. Return error value FALSE." );
    return false;
  }
  
  // Each structure item
  for( var i=0; i < pageStructure.length; i++ ) {
    // Turn page's id into action script: set the current page to that page
    pageStructure[i].action = 'Page.setPage("' + pageStructure[i].id + '");';
    
    // Recursion for the children
    if( typeof pageStructure[i].children !== "undefined" ) {
      console.log( "Navi::_addActionsToPageStructure   "+pageStructure[i].id+": go through children.");
      pageStructure[i].children = self._addActionsToPageStructure( pageStructure[i].children );
    }
  }
  return pageStructure;
}






//////////////////////////// END OF FILE ////////////////////////////
/*



  /*
  
  
  return Page.observePageStructureChanges( navi.pageStructureId, naviId, publisher, self, {
    added: function (naviId, publisher, naviSelf, newDoc) {
      console.log( "Navi::_observePageStructure   Page structure item was added: " + EJSON.stringify(newDoc) );
      
      // Update the whole navi structure
      naviSelf._update(naviId);
      console.log( "Navi::_observePageStructure   Navi structure updated." );
      
      // Get the navi structure item from DB
      var navi = naviSelf.Navis.findOne({_id: navi._id});
      
      // Tell the client that this navi structure (specified by navi._id) was emptied and then filled
      publisher.removed("navis", navi._id);
      publisher.added("navis", navi._id, navi);
    },
    changed: function (naviId, publisher, naviSelf, newDoc, oldDoc) {
      
    },
    removed: function (naviId, publisher, naviSelf, oldDoc) {
      
    }
  });
*/
  
  


/*
Function: Creates a mongo database selector for the given navi name

Return value:

  false: no proper selector could be created.

Version history:
  2.12.2013 Panu
    Went through
*/
/*
Navi._createNaviSelector = function (navi) {
  console.log("Navi::_createNaviSelector   navi=" + EJSON.stringify(navi) );
  var self = Navi;
  
  // No parameter given?
  if( typeof navi === "undefined" ) {
    console.log("Navi::_createNaviSelector   No navi given, so use the default navi selection: [\"default\"]"
    navi = self._default; // Use default value
  }
  // Navi name not a string?
  else if( typeof navi !== "string" ) {
    console.log( "Navi::_createNaviSelector   The requested navi name is not a string, but a : " + typeof navi );
    return false; // Error
  }
  
  // Mongo selector for this Navi
  var orSelector = [];
  for( var i = 0; i < navi.length; i++ ) {
    orSelector.push({id: navi[i]});
  }
  
  console.log( "Publish, selector=" + EJSON.stringify(selector) );
  
  return orSelector;
}


*/
//////////////////////////// ELEMENT: NAVI (SERVER) ////////////////////////////
Navi = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
Navi.Navis = new Meteor.Collection("navis");

//// INSERT INITIAL DATA
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

///////////////////////// PRIVATE PROPERTIES /////////////////////////
// Navi to be used if the client doesn't request any specific navi
Navi._default = "default";

// Handles for Page structure observers
Navi._pageStructureObservers = [];


//////////////////////////// VIEW ////////////////////////////
//// SELECT
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
  // Default value for ids needed?
  if( typeof ids === "undefined" ) {
    ids = [Navi._default];
    console.log( "Navi::publish Set default value for ids: " + EJSON.stringify(ids) );
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
      console.log("Navi::publish Error: id is not a string: " + EJSON.stringify(ids[i]) );
      continue;
    }
    
    // Find the navi
    var navi = Navi.Navis.findOne({id:ids[i]});
    if( !navi ) {
      console.log("Navi::publish   Navi not found: " + ids[i] + ", skip it." );
      continue;
    }
    
    // Add navi to the returnable navis
    returnableNavis.push({id: ids[i]});
  }
  
  // Return a cursor for all returnable navis
  console.log( "Navi::publish: ids=" + EJSON.stringify(ids) + ". Return=" + EJSON.stringify( returnableNavis ) );
  return Navi.Navis.find({$or:returnableNavis});
});


Navi.Navis.allow({
//// INSERT
insert: function() {
  // TODO Only with admin rights
  // this.userId;
  return true;
},
  
//// UPDATE
update: function() {
  // TODO Only with admin rights
  return true;
},

//// REMOVE
remove: function() {
  // TODO Only with admin rights
  return true;
}
});


//////////////////////////// CONTROLLER ////////////////////////////
//// INTERFACE FOR OTHER ELEMENTS
//Navi.fn = function () { }

//// CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  //Txtcmd.set([]);
  
  // Add observers for all page structures that are used by some navi
  
  // Go through all navis
  var navis = Navi.Navis.find().fetch();
  for( var i = 0; i < navis.length; i++ ) {
    
    // Navi has a page structure?
    if( typeof navis[i].pageStructureId !== "undefined" ) {
      
      // Start observing changes in Page's structures      
      Navi._pageStructureObservers[navis[i].id]
        = Page.getPageStructureChanges( navis[i].pageStructureId ).observe({
          
        added: function (newDoc) {
          console.log( "Navi::CONNECT::Page::added" ); //    newDoc=" + EJSON.stringify(newDoc)
          Navi._update(navis[0].id);
        },
        updated: function (newDoc, oldDoc) {
          console.log( "Navi::CONNECT::Page::updated" );
          Navi._update(navis[0].id);
        },
        removed: function (oldDoc) {
          console.log( "Navi::CONNECT::Page::removed" );
          Navi._update(navis[0].id);
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
  // Not a string?
  if( typeof id !== "string" ) {
    console.log( "Navi::_update   The requested navi id is not a string, but a : " 
      + typeof id + ". Return error value FALSE." );
    return false;
  }
  
  // Get navi structure
  var navi = Navi.Navis.findOne({id:id});
  
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
  
  // Convert to navi structure = insert action scripts in place of the page id's
  var pages = Navi._addActionsToPageStructure(pageStructure); // TODO Is this really the best format for navi structure?
  
  // Error in creating navi structure?
  if( pages === false ) {
    // Don't use this navi, just in case...
    console.log( "Navi::_update   Error in creating navi structure out of the page structure. Return error value FALSE." );
    return false;
  }
  
  // Update the navi with new pages
  console.log( "Navi::_update   Update the '"+id+"' navi's pages." );
  var dbSuccess = Navi.Navis.update({_id:navi._id},{$set:{pages:pages}});
  if( dbSuccess ) {
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
      pageStructure[i].children = Navi._addActionsToPageStructure( pageStructure[i].children );
    }
  }
  return pageStructure;
}


//////////////////////////// END OF FILE ////////////////////////////
/*

*/
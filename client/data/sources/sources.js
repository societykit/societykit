//////////////////////////// ELEMENT: SOURCES ////////////////////////////
/*
- Handles data about "sources": adding/elementing/deleting
*/
Sources = Items.inherit({
  objName: "sources",
  
  templates: {
    quickView: Template.sourcesItemQuick,
    fullView: Template.sourcesItemFull,
    editableView: Template.sourcesItemEditable,
  },
  
  validate: function(data) {
    var isValid = true;
    var invalids = {};
    
    // TODO: Validate all the fields of the given source
    /*
    if( typeof data.name === "undefined" ) {
      invalids[data.name] = "Sorry, error on the website.";
      console.log("Sources::source::validate   Data: "+EJSON.stringify(data)+" -> name is missing." );
      isValid = false;
    }
    
    if( !data.name.length ) {
      invalids[data.name] = "Name of the source can not be empty";
      isValid = false;
    }
    // TODO: Unique name for txt 1?
    
    if( isValid ) {
      console.log( "Sources::source::validate   Data: "+EJSON.stringify(data)+" -> Valid!" );
      return false;
    }
    else {
      console.log( "Sources::source::validate   Data: "+EJSON.stringify(data)+" -> Invalid values: " + EJSON.stringify(invalids) );
      return invalids;
    }
    */
    
    if( isValid ) {
      return false;
    }
    else {
      return invalids;
    }
  }
});


// Function: Returns all possible 'media types' of a source.
// Used by: EDIT SOURCE template and ADD SOURCE template
Sources.mediatypeValues = function () {
  //var sources2 = Sources2.get();
  // TODO Selected - under if statement. Put the 'selected:"selected"' field only on the selected source.
  // TODO Check if the current value is invalid/outdated, inform this to the user on the screen
  return [
    {value:"literature",title:"Literature",selected:this.dropdown}, 
    {value:"www",title:"WWW",selected:this.dropdown}, 
    {value:"other",title:"Other",selected:this.dropdown}
  ];
}

// Function: Returns all possible 'availability' types of a source
// Used by: EDIT SOURCE template and ADD SOURCE template
Sources.availabilityValues = function () {
  //var sources2 = Sources2.get();
  // TODO Selected - under if statement. Put the 'selected:"selected"' field only on the selected source.
  // TODO Check if the current value is invalid/outdated, inform this to the user on the screen
  return [
    {value:"available",title:"Available",selected:this.dropdown}, 
    {value:"restrictedAccess",title:"Restricted access",selected:this.dropdown}, 
    {value:"unavailable",title:"Unavailable",selected:this.dropdown}
  ];
}


//////////////////////////// END OF FILE ////////////////////////////
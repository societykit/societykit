//////////////////////////// ELEMENT: SOURCES ////////////////////////////
/*
Handles data about "sources": adding/elementing/deleting
*/

Sources = Items.inherit({
  className: "sources",
  itemName: "source",
  dropdowns: {
    mediaTypes: [
      {value:"literature",title:"Literature"},
      {value:"www",title:"WWW"},
      {value:"other",title:"Other"}
    ],
    availabilityTypes: [
      {value:"available",title:"Available",selected:this.dropdown},
      {value:"restrictedAccess",title:"Restricted access",selected:this.dropdown},
      {value:"unavailable",title:"Unavailable",selected:this.dropdown}
    ]
  },
  itemsConnections: {
    relatedToCompany: { toClass: "companies", field: "name" }
  }
});

// Add or override helper functions
Sources.template.validate = function (data) {
  var invalid = false;
  var invalidFields = {};
  // TODO: Validate all fields: author, title, etc.

  if( invalid ) {
    return invalidFields;
  }
  else {
    return invalid;
  }
}


//////////////////////////// END OF FILE ////////////////////////////
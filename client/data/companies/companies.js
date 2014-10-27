//////////////////////////// ELEMENT: COMPANIES ////////////////////////////
/*
Handles data about "companies": adding/elementing/deleting
*/

Companies = Items.inherit({
  className: "companies",
  itemName: "company",
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
  }
});

// Add or override helper functions
Companies.template.validate = function (data) {
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


// These are compulsory for completing the inheritance of the items class.
Companies.template.listItems = function() {
  return Companies.db.find();
}



//////////////////////////// END OF FILE ////////////////////////////
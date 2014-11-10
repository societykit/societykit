//////////////////////////// ELEMENT: PRODUCTTYPES ////////////////////////////
/*

*/

ProductTypes = Items.inherit({
  className: "productTypes",
  itemName: "product type"
});

// Add or override helper functions
ProductTypes.template.validate = function (data) {
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
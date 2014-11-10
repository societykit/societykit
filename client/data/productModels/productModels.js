//////////////////////////// ELEMENT: PRODUCTMODELS ////////////////////////////
/*

*/

ProductModels = Items.inherit({
  className: "productModels",
  itemName: "product model"
});

// Add or override helper functions
ProductModels.template.validate = function (data) {
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
//////////////////////////// ELEMENT: PRODUCTITEMS ////////////////////////////
/*

*/

ProductItems = Items.inherit({
  className: "productItems",
  itemName: "product",
  itemsConnections: {
    manufacturer: { toClass: "companies", field: "name" },
    productModel: { toClass: "productModels", field: "name" },
    productType: { toClass: "productTypes", field: "name" },
    image: { toClass: "productModels", field: "image" },
  }
});

// Add or override helper functions
ProductItems.template.validate = function (data) {
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
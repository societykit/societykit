//////////////////////////// ELEMENT: PRODUCTITEMS ////////////////////////////
/*

*/

ProductItems = Items.inherit({
  className: "productItems",
  itemName: "product",
  sorting: [["productType", "asc"], ["manufacturer", "asc"], ["productModel", "asc"],
    ["bought", "asc"], ["broke", "asc"], ["_id", "asc"]]
  /*,
  itemsConnections: {
    manufacturer: { toClass: "companies", field: "name" },
    productModel: { toClass: "productModels", field: "name" },
    productType: { toClass: "productTypes", field: "name" },
    image: { toClass: "productModels", field: "image" },
  }*/
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

Template.productItemsEditableView.settingsOwner = function() {
  return {
   position: "top",
   limit: 5,
   rules: [
     {
       collection: ProductItems.db,
       field: "owner",
       template: Template.productItemsAutocompleteOwner
     }
   ]
  }
};


Template.productItemsEditableView.settingsManufacturer = function() {
  return {
   position: "top",
   limit: 5,
   rules: [
     {
       collection: ProductItems.db,
       field: "manufacturer",
       template: Template.productItemsAutocompleteManufacturer
     },
   ]
  }
};



Template.productItemsEditableView.settingsProductModel = function() {
  return {
   position: "top",
   limit: 5,
   rules: [
     {
       collection: ProductItems.db,
       field: "productModel",
       template: Template.productItemsAutocompleteProductModel
     },
   ]
  }
};



Template.productItemsEditableView.settingsProductType = function() {
  return {
   position: "top",
   limit: 5,
   rules: [
     {
       collection: ProductItems.db,
       field: "productType",
       template: Template.productItemsAutocompleteProductType
     },
   ]
  }
};

//////////////////////////// END OF FILE ////////////////////////////
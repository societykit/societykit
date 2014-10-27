//////////////////////////// ELEMENT: SOCIETIES ////////////////////////////
/*
- An abstract class for handling any kinds of "societies".
- Includes functionalities for adding/elementing/deleting these societies
on the user interface.
*/

Societies = new Items.inherit({
  className: "societies",
  itemName: "society"
});

// Add or override helper functions
Societies.template.validate = function (data) {
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
Societies.template.listItems = function() {
  return Societies.db.find();
}


// Function: Returns all possible 'issue types' of a society.
// Used by: EDIT SOCIETY template and ADD SOCIETY template
/*
Societies.issuetypeValues = function () {

  return [
    {value:"environment",title:"Environment"}, 
    {value:"economy",title:"Economy"}
  ];
}
*/

//////////////////////////// END OF FILE ////////////////////////////

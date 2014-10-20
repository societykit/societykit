//////////////////////////// ELEMENT: SOCIETIES ////////////////////////////
/*
- An abstract class for handling any kinds of "societies".
- Includes functionalities for adding/elementing/deleting these societies
on the user interface.
*/
Societies = Items.inherit({
  objName: "societies",
  
  templates: {
    quickView: Template.societiesItemQuick,
    fullView: Template.societiesItemFull,
    editableView: Template.societiesItemEditable,
  },
  
  validate: function(data) {
    var isValid = true;
    var invalids = {};
    
    // TODO: Validate all the fields of the given society
    
    if( isValid ) {
      return false;
    }
    else {
      return invalids;
    }
  }
});


// Function: Returns all possible 'issue types' of a society.
// Used by: EDIT SOCIETY template and ADD SOCIETY template
Societies.issuetypeValues = function () {

  return [
    {value:"environment",title:"Environment"}, 
    {value:"economy",title:"Economy"}
  ];
}


//////////////////////////// END OF FILE ////////////////////////////

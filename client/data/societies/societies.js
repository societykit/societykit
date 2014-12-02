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

Template.societiesView.haveEditAccessToTheItem = function () {
  if ( !this.owner ) {
    return true;
  }  
  else if ( this.owner === "unknown" ) {
    return true;
  }
  else if ( this.owner === Meteor.userId() ) {
    return true;
  }
  else {
    return false;
  }
}


Template.societiesEditableView.userId = function () {
  if ( Meteor.userId() ) {
    return Meteor.userId();
  }
  else {
    return "unknown";
  }
}


Template.societiesEditableView.userEmail = function () {
  if ( Meteor.userId() && Meteor.user() && Meteor.user().emails.length ) {
    return Meteor.user().emails[0].address;
  }
  else {
    return "unknown";
  }
}

Template.societiesFullView.helpers({

  memberCount: function () {
    return Societies2Users.find( { society: this._id }).count();
  },
  notMember: function () {
    if ( Meteor.userId() && Societies2Users.find( { society: this._id, user: Meteor.userId() }).count() ) {
      return false;
    }
    else {
      return true;
    }
  }

});


Template.societiesJoin.helpers({

  memberOfTheSociety: function () {
    if ( Meteor.userId() && Societies2Users.findOne( { society: this._id, user: Meteor.userId() } ) ) {
      return true;
    }
    else {
      return false;
    }
  }
});


// * * * EVENTS
Template.societiesJoin.events({
  
  'click .join': function () {
    if ( Meteor.userId() ) {
      Societies2Users.insert( { society: this._id, user: Meteor.userId() } );
    }
    else {
      console.log("Joining failed: Not signed in");
    }
  },
  'click .exit': function () {
    if ( Meteor.userId() ) {
      var toBeDeleted = Societies2Users.findOne( { society: this._id, user: Meteor.userId() } );
      Societies2Users.remove( { _id : toBeDeleted._id } );
    }
    else {
      console.log("Exiting failed: Not signed in");
    }
  }
  
});

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

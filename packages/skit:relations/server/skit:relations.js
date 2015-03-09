if(Meteor.isServer) {
    
Meteor.methods({
  
  skitRelationsInsert: function (doc) {
    var log = "skit:relations :: Meteor.methods.skitRelationsInsert :: ";
//     console.log(log + "Called!");
    //console.log(log + "doc=" + EJSON.stringify(doc));
    
    // Important server-side check for security and data integrity
    //check(doc, skitRelations.getFormSchema( Schemas.societies ));
    
    // Create objects
    
    
    // Create relations
    
    
    //this.unblock();
  }
  
});


Meteor.publish("skitRelationsTypes", function () {
  return RelationTypes.find();
});

RelationTypes.allow({
  insert: function () {
    return false;
  },
  update: function () {
    return false;
  },
  remove: function () {
    return false;
  }
});

Meteor.publish("skitRelations", function () {
  return Relations.find();
});

Relations.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});



}
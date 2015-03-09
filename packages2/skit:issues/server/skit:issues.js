if( Meteor.isServer ) { 
Meteor.publish("skitIssues", function () {
  return skitIssues.db.find();
});

skitIssues.db.allow({
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
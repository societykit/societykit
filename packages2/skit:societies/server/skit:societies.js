if( Meteor.isServer ) { 
Meteor.publish("skitSocieties", function () {
  return skitSocieties.db.find();
});

skitSocieties.db.allow({
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


// Schemas for relations of societies
skitRelations.setRelationType({
  relationType: "relatedTo",
  
  cl1: {
    cl: "skitSocieties",
    attrs: ["name"],
    minCount: 0,
    maxCount: Infinity,
  },
  
  cl2: {
    cl: "skitIssues",
    attrs: ["name"],
    minCount: 0,
    maxCount: Infinity
  }
});

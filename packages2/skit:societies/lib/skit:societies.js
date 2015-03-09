// Exported interface to users of this package
skitSocieties = {};

// Create collection
skitSocieties.db = new Mongo.Collection("skitSocieties");

// Own schema
skitRelations.setSchema(
  "skitSocieties",
  skitSocieties.db,
  {
    name: {
      type: String,
      label: "Name",
      max: 200
    },
    issues: {
      label: "Issues",
      type: "skitRelation",
      relationType: "relatedTo",
      cl: "skitIssues"
    },
    description: {
      type: String,
      label: "Short description",
      max: 1000,
      autoform: {
        rows: 10
      }
    },
  }
);




/////////////////// OLD STUFF ///////////////////////

  /*issues: {
    type: [String],
    label: "Issues",
    minCount: 2,
    maxCount: 4
  }*/
  
/*skitRelations.getSchema({
      me: "societies",
      relation: ["societies","isRelatedTo","issues"]
    }),*/


/*SimpleSchema.extendOptions({
  index: Match.Optional(Match.OneOf(Number, String, Boolean)),

  
  
addresses: {
  type: [Object],
  minCount: 1,
  maxCount: 4
},
    
    
    
*/
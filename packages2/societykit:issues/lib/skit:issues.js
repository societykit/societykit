// Exported interface to users of this package
skitIssues = {};

// Create collection
skitIssues.db = new Mongo.Collection("skitIssues");

// Own schema
skitRelations.setSchema(
  "skitIssues",
  skitIssues.db,
  {
    name: {
      type: String,
      label: "Name",
      max: 200
    },
    description: {
      type: String,
      label: "Description",
      optional: true,
      max: 1000
    }/*,
    societies: {
      label: "Related societies",
      type: "skitRelation",
      relationType: "relatedTo",
      cl: "skitSocieties"
    }*/
  }
);

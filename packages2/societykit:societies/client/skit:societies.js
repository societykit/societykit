if (Meteor.isClient) {

// Subscribe to database
Meteor.subscribe("skitSocieties");

// Template helpers to get db and schema
Template.societiesInsert.helpers({
  db: skitSocieties.db,
  schema: skitRelations.getFormSchema("skitSocieties")
});
skitRelations.setForm("societiesInsertForm", "skitSocieties", "insert");


Template.society.helpers({
  getData: function ( field ) {
    //console.log("getData, society id = " + Session.get("society") );
    
    //console.log("societies = " + EJSON.stringify(skitSocieties.db.find().fetch()));
    
    var item = skitSocieties.db.findOne(Session.get("society"));
    
    // Item not found?
    if( !item ) {
      return "";
    }
    
    //console.log("getData for item: ", item );
    return item[ field ];
  },
  
  getMyId: function (field) {
    return Session.get("society");
  }
});


}

////////////////// OLD STUFF ////////////////////
/*
  docToForm: function(doc) {
      
      // Add relations
      console.log("docToForm", doc);
      
      
      
      if (_.isArray(doc.tags)) {
        doc.tags = doc.tags.join(", ");
      }
      
      return doc;
    },
    formToDoc: function(doc) {
      
      
      if (typeof doc.tags === "string") {
        doc.tags = doc.tags.split(",");
      }
      
      console.log("return: ", doc);
      return doc;
    },
    
  
  
  
  // The autoform also shows the relations
  schema: function () {
    return new SimpleSchema( skitRelations.getFormSchema( Schemas.societies ) );
  }
  
  
  

/*
// Template helpers for all templates to get list of issues (or other items...)
Template.registerHelper("relations", function (cl) {
    var result = [];
    
    // Create a list of label-value pairs from the related collection's items
    // TODO: select collection based on the cl parameter
    var list = Issues.db.find().fetch();
    for( var i in list ) {
      result.push({ label: list[i].name, value: list[i]._id });
    }
    
    return result;
  }
);

AutoForm.hooks({
  societiesInsertForm: {
    docToForm: function(doc) {
      
      // Get relations
      var rels = Relations.db.find({
        cl1: "societies",
        cl2: "issues",
        id1: "x",
        type: "societyIsRelatedToIssue"
      });
      
      // Get related documents
      var docs = Issues.db.find(rels);
      
      // Add docs
      
      
      
      if (_.isArray(doc.tags)) {
        doc.tags = doc.tags.join(", ");
      }
      return doc;
    },
    formToDoc: function(doc) {
      if (typeof doc.tags === "string") {
        doc.tags = doc.tags.split(",");
      }
      return doc;
    }
  }
});
*/  

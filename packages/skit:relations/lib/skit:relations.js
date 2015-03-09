// Export these as interface to the package
skitRelations = {};
// Registered schemas go here
skitRelations.schemas = {};


// Own databases
Relations = new Mongo.Collection("skitRelations");
RelationTypes = new Mongo.Collection("skitRelationsTypes");




// For copying objects
// http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}



exists = function ( params ) {
  //console.log("Exists? called, params: " + EJSON.stringify( params ));
  //console.log("RelationTypes = " + EJSON.stringify(RelationTypes.find().fetch()));
  
  // Exists in this order?
  var ex = RelationTypes.find({
    relationType: params.relationType,
    cl1: params.cl1.cl,
    cl2: params.cl2.cl
  });
  //console.log("Ex: ", ex);
  if( ex.count() > 0 ) {
    return {
      id: ex.fetch()[0]._id,
      cl1: params.cl1,
      cl2: params.cl2,
      swapped: false
    };
  }
  
  // Exists in reversed order of collections?
  ex = RelationTypes.find({
    relationType: params.relationType,
    cl1: params.cl2.cl,
    cl2: params.cl1.cl
  });
  if( ex.count() > 0 ) {
    
    // Swap the parameters
    return {
      id: ex.fetch()[0]._id,
      cl1: clone(params.cl2),
      cl2: clone(params.cl1),
      swapped: true,
    };
  }
  
  // Doesn't exist?
  return undefined;
}



skitRelations.setRelationType = function( params ) {
/*
Operation:
  Saves the relation type to database
params = {
  relationType: "isRelatedTo",
  
  cl1: {
    cl: "skitSocieties",
    attrs: "name",
    minCount: 0,
    maxCount: Infinity,
  },
  
  cl2: {
    cl: "skitIssues",
    attrs: "name",
    minCount: 0,
    maxCount: Infinity
  }
}

*/
//   console.log("SetRelationType!, params=", params);
  
  var swapped = exists( params );
  
  // Update?
  if( swapped !== undefined ) {
    RelationTypes.update({_id: swapped.id}, {$set: {
      cl1: swapped.cl1.cl,
      attrs1: swapped.cl1.attrs,
      minCount1: swapped.cl1.minCount,
      maxCount1: swapped.cl1.maxCount,
      cl2: swapped.cl2.cl,
      attrs2: swapped.cl2.cl,
      minCount2: swapped.cl2.minCount,
      maxCount2: swapped.cl2.maxCount
    }});
//     console.log("Updated relation type: ", RelationTypes.findOne(swapped.id));
  }
  
  // Insert?
  else {
    var id = RelationTypes.insert({
      relationType: params.relationType,
      cl1: params.cl1.cl,
      attrs1: params.cl1.attrs,
      minCount1: params.cl1.minCount,
      maxCount1: params.cl1.maxCount,
      cl2: params.cl2.cl,
      attrs2: params.cl2.cl,
      minCount2: params.cl2.minCount,
      maxCount2: params.cl2.maxCount
    });
//     console.log("Inserted relation type: ", RelationTypes.findOne(id));
  }
  
  return true;
}




skitRelations.setSchema = function( name, cl, schema ) {
/*
Parameters:
  name = unique name for the schema
  cl = collection related to the schema
  schema = schema with relations included, eg.
  
    {
      name: {
        type: String,
        label: "Name",
        max: 200
      },
      issues: {
        type: "skitRelation"
        relation: {"skitSocieties","relatedTo","skitIssues"},
        label: "Issues"
      }
    }
    
Operation:
  Constructor. Creates a SimpleSchema that has registered relations.
  
Returns:
  An instance of SimpleSchema, where all the relation fields are removed
  so it includes only the schema's own properties
  
*/
//   console.log("setSchema", name, schema);
  
  // Create a cleaned schema for documents: all relations removed
  var docSchema = {};
  
  // Go through all given fields and fill in both schemas
  for( var field in schema ) {
    
    // Own field?
    if( schema[field].type !== "skitRelation" ) {
      // Add to both schemas
      docSchema[field] = schema[field];
    }
  }
  
  // Save differernt versions of the schema
  skitRelations.schemas[name] = {
    def: schema,
    doc: docSchema,
    form: undefined,
    db: cl
  };
  
  // Attach doc schema to own database collection
  cl.attachSchema( new SimpleSchema( docSchema ));
  
  // Return
  return true;
}






skitRelations.getFormSchema = function( name ) {
/* Operation: 
 *    Creates a function that creates and returns the schema for a form for the
 *    given schema/collection.
 * Params:
 *    name = name of the schema/collection
 * Returns:
 *    A function that reactively returns the updated schema of the requested
 *    collection "name". This is to be assigned as
 *    a template helper function.
 */
  return function () {
//     console.log("getFormSchema!");
        
    // Schema with all relations encoded
    var schema = skitRelations.schemas[ name ].def;
    if( ! schema ) {
//       console.log("Error! Undefined schema: " + name );
      return {};
    }
    
    // Create a form schema for creating a form with autoForm
    // by turning the relation definitions into fields
    var formSchema = {};
    
    // Counter to give unique id for each relation
    var relationCounter = 1;
    
    for( var field in schema ) {
      //console.log("Next field: " + field );
      
      // Own field?
      if( schema[field].type !== "skitRelation" ) {
        // Add to form
        formSchema[field] = schema[field];
        
//         console.log("Own field: " + field + "! Now schema = " +EJSON.stringify( formSchema ));
      
      }
      
      // Relation field?
      else {
//         console.log("Relation field...");
                
        // Helper function for recursive call
        var createRelatedFields = function( formSchema, relatedField, relationId, relationPrefix ) {
          
//           console.log("CreateRelatedFields! formschema="+EJSON.stringify(formSchema)+
//             ", relatedField="+EJSON.stringify(relatedField)+", relationId="+relationId+", relationPrefix="+
//             relationPrefix );
          
          if( typeof relationPrefix !== "string" ) {
            relationPrefix = "";
          }
          
          var relationCounter = 1;
          
          // Swap order?
          var swapped = exists({
            relationType: relatedField.relationType,
            cl1: {
              cl: name
            },
            cl2: {
              cl: relatedField.cl
            }
          });

          if( swapped === undefined ) {
//             console.log("Error! Undefined relation type: " + relatedField.relationType
//               + ". Skip this relation." );
            return false;
          }
          
          // Get related schema
          var relatedSchema = skitRelations.schemas[ relatedField.cl ].def;
          if( !relatedSchema ) {
//             console.log("Error! Undefined related collection's schema: " + relatedField.cl
//               + ". Skip this relation." );
            return false;
          }
//           console.log( "relatedSchema:" + EJSON.stringify( relatedSchema ));

          // Get attrs of the related collection
          var relationType = RelationTypes.findOne( swapped.id );
          var attrs = relationType.attrs2;
          if( swapped ) {
            attrs = relationType.attrs1;
          }
//           console.log("Related fields = " + EJSON.stringify( attrs ));
          
          // Go through each attr of the related collection
          for( var iRelField in attrs ) {
//             console.log("Add next relatedField: " + attrs[iRelField]);
            
            // add to previous prefix:
            // eg. "skitRelation-1--issues--relatedTo--skitIssues--(originalNameOfField)"
            var myRelationPrefix = relationPrefix + 
              "skitRelation-" + relationId + "--"
              + field + "--"
              + relatedField.relationType + "--"
              + relatedField.cl + "--";
//             console.log("myRelationPrefix="+myRelationPrefix);
            
            // Not a relation field?
            if( relatedSchema[ attrs[iRelField] ].type !== "skitRelation" ) {
//               console.log("Own field of the related schema. Add to formSchema.");
              
              // Add the related field to the form
              formSchema[ myRelationPrefix + attrs[iRelField] ] = relatedSchema[ attrs[iRelField] ];
//               console.log("Added related field: " + myRelationPrefix + attrs[iRelField] 
//                 + "=" + EJSON.stringify( formSchema[ myRelationPrefix + attrs[iRelField] ] ));
            }
            
            // Relation field inside the related field?
            else {
              // Recursively go through related fields
              createRelationFields( formSchema, relatedSchema[ attrs[iRelField] ], relationCounter, myRelationPrefix );
              
              // TODO: Avoid circular relations
              
              // Added fields of a related schema
              relationCounter += 1;
            }
          }
          
          return true;
        }
        
        createRelatedFields( formSchema, schema[field], relationCounter );
      }
    }
    
    // Update form schema
    skitRelations.schemas[name].form = formSchema;
    
//     console.log("return: " + EJSON.stringify( formSchema ));
    return new SimpleSchema( formSchema );
  }
}





   
  
  
////////////////////////// OLD STUFF ////////////////////////////

  /*
    // Update this
    var id = current.fetch()[0]._id;
    skitRelations.types.update({_id: id}, {$set: params});
  }

}*/
  
  
  /*

// Private stuff
_relations = {};



skitRelation = function (params) {
/*
params = {
  relationType
  cl1
  cl2
  count1min
  count1max
  count2min
  count2max
}
*/
  /*
  // Get relation type id and set it as default value
  var relationTypeId = skitRelations.types.find({
    cl1: params.cl1,
    cl2: params.cl2,
    type: params.relationType
  });
  if( !relationTypeId ) {
    relationTypeId = skitRelations.types.find({
      cl1: params.cl1,
      cl2: params.cl2,
      type: params.relationType
    });
  }
  if( !relationTypeId ) {
    // TODO: ERROR
    return false;
  }
  
  // Create schema
  var result = new SimpleSchema({
    relationTypeId: {
      type: String,
      label: "relationTypeId",
      defaultValue: relationTypeId
    },
    id1: {
      type: String,
      label: "id1",
      minCount: params.minCount1,
      maxCount: params.maxCount1
    },
    id2: {
      type: [String],
      label: "id2",
      minCount: params.minCount2,
      maxCount: params.maxCount2
    },
    id2new: {
      type: [Object],
      label: "id2new"
    }
  });
  *//*
  return result;
  
}











skitRelations.getDbSchema = function ( schema ) {
  
  // First, create a copy of the schema
  if( Meteor.isClient ) {
    var copySchema = $.extend({}, schema );
  }
  else {
    // http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
    function clone(obj) {
      if (null == obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
    }
    var copySchema = clone(schema);
  }
  
  
  var result = {};
  
  // Add only non-relation attributes to the result schema
  for( var attr in copySchema ) {
    if( copySchema[attr].type !== "relation" ) {
      result[attr] = copySchema[attr];
    }
  }
  return result;
}

*/

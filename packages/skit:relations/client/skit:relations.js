if(Meteor.isClient) {

Meteor.subscribe("skitRelationsTypes", function () {
//   console.log("Subscribed to skitRelationTypes!");
});

Meteor.subscribe("skitRelations", function () {
//   console.log("Subscribed to skitRelations!");
});


AutoForm.addInputType("skitRelation1", {
  template: "skitRelation1",
  valueOut: function () {
    return this.val();
  },
  contextAdjust: function (context) {
    
    return context;
  }
});

// Activate typeahead
Template.skitRelation1.rendered = function() {
  Meteor.typeahead(this.find('.typeahead'))
}

Template.skitRelation1.helpers({
  collection: function () {
    // Get name of the collection
    var cl = $('.typeahead').attr("skitrelationcollection");
    
    // Find all items from that collection
    return skitRelations.schemas[ cl ].db.find().fetch().map(function(it){
      
      // Which attributes to give: depends on relation type specs!
      return it.name;
    });
    
  }
});



// Helper function
var analyzeString = function( str ) {
  // Analyze the name string, eg.
  /*
    * "description"
    * --> Result = {
    *    relation: false,
    *    name: "description"
    *  }
    * 
    * "skitRelation-1--productModel--modelOf--productModels--name"
    * --> Result = {
    *    relation: true,
    *    relationIndex: 1,
    *    fieldName: "productModel",
    *    relationType: "modelOf",
    *    cl: "productModels",
    *    attr: {
    *      relation: false,
    *      name: "name"
    *  }
    * 
    * "skitRelation-1--productModel--modelOf--productModels--skitRelation-1-manufacturer--companies--name"
    * --> Result = {
    *    relation: true, 
    *    relationIndex: 1,
    *    fieldName: "productModel"
    *    relationType: "modelOf",
    *    cl: "productModels",
    *    attr: {
    *      relation: true,
    *      relationIndex: 1,
    *      fieldName: "manufacturer",
    *      relationType: "manufacturer"
    *      cl: "companies",
    *      attr: {
    *        relation: false,
    *        name: "name"
    *      }
    *    }
    *  }
    */
  var result = {};
  
  // Take away "skitRelation-" (length=13)
  var index = str.indexOf("skitRelation-");
  // Not relation?
  if( index === -1 ) {
  //  console.log("Analysis, Return result = {relation: false, name: "+str+"}");
    return {
      relation: false,
      name: str
    };
  }
  result.relation = true;
  
  str = str.substring(13);
  index = 0;
  // Take away the number (=relation index)
  
  while( index < str.length && !isNaN( str[index] ) ) {
    index++;
  }
  result.relationIndex = parseInt( str.substring(0, index) );
  
  // Take away the number and "--"
  str = str.substring(index+2);
  
  // Get fieldName
  index = str.indexOf("--");
  result.fieldName = str.substring(0, index);
  str = str.substring( result.fieldName.length + 2 );
  
  // Get relation type
  index = str.indexOf("--");
  result.relationType = str.substring(0, index);
  str = str.substring( result.relationType.length + 2 );
  
  // Get collection name
  index = str.indexOf("--");
  result.cl = str.substring(0, index);
  str = str.substring( result.cl.length + 2 );
  
  // Get name of the relation item
  result.attr = analyzeString(str);
  
  //console.log("Analysis, Return result="+EJSON.stringify(result));
  return result;
}

  

Template.skitRelationField.helpers({
  modeIs: function (mode) {
    return (this.mode === mode);
  },
  
  
  relatedItems: function () {
//     console.log("RELATED ITEMS!");
    
    // Get relation collection's name
//     console.log( skitRelations.schemas[this.cl].def );
    var relationSpecs = skitRelations.schemas[this.cl].def[this.name];
//     console.log("relationSpecs="+EJSON.stringify(relationSpecs));
    
//     console.log("parent 1 = " + EJSON.stringify( Template.parentData(1)));
//     console.log(this);
    myId = this._id;
    if( myId === undefined ) {
      var myId = Template.parentData(1)._id;
    }
//      console.log( "myId = " + myId );
    
    
    // Get relation type id
    var relationType = exists({
      relationType: relationSpecs.relationType,
      cl1: {
        cl: this.cl,
        id: myId
      },
      cl2: {
        cl: relationSpecs.cl,
        id: "iterate"
      }
    });
    
    // Relation type doesn't exist?
    if( !relationType ) {
      return [];
    }
//     console.log(relationType);
    
    // Get related id's and find all related items
    var relationIds = [];
    var items = [];
    if( !relationType.swapped ) {
      var relations = Relations.find({
        relationType: relationType.id,
        id1: relationType.cl1.id
      }, {fields: {id2: 1}}).fetch();
      for( var i in relations ) {
        relationIds.push( relations[i].id2 );
      }
      items = skitRelations.schemas[relationType.cl2.cl].db.find({_id: {$in: relationIds}});
    }
    else {
      var relations = Relations.find({
        relationType: relationType.id,
        id2: relationType.cl2.id
      }, {fields: {id1: 1}}).fetch();
      for( var i in relations ) {
        relationIds.push( relations[i].id1 );
      }
      items = skitRelations.schemas[relationType.cl1.cl].db.find({_id: {$in: relationIds}});
    }
    
//     console.log("Return items: "+EJSON.stringify(items.fetch()));
    return items;
  },
  
  
  fields: function () {
//      console.log("Template.skitRelationField :: fields: called! name="+this.name);
    
    // Get schema
    var schemaName = this.cl;
    var schema = skitRelations.schemas[ schemaName ].def;
    
    // Schema not defined yet?
    if( !schema ) {
//        console.log("Schema not defined yet. Return no relation fields.");
      return [];
    }
//      console.log("schema.def:", EJSON.stringify(schema));
    
    var field = schema[this.name];
//      console.log("field of schema.def:", EJSON.stringify(field));
    
    var formSchema = skitRelations.schemas[ schemaName ].form;
    if( formSchema === undefined ) {
      formSchema = skitRelations.getFormSchema( schemaName )();
    }
    
//      console.log("formSchema=" + EJSON.stringify(formSchema));
    
    
    // Go through each field in the form schema
    var relationFields = [];
    for( var fieldName in formSchema ) {
      var analyzedField = analyzeString( fieldName );
      if( analyzedField.relation && analyzedField.fieldName === this.name ) {
        
        var context = {
          name: fieldName,
          originalName: analyzedField.attr.name,
          label: formSchema[fieldName].label,
          cl: analyzedField.cl,
          relationType: analyzedField.relationType,
          relationId: analyzedField.relationIndex
        };
        
        relationFields.push( context );
      }
    }
    
//      console.log("Return relationFields: " + EJSON.stringify(relationFields));
    return relationFields;
  },
  
  getViewFields: function () {
//      console.log("Template.skitRelationField :: getViewFields: called!");
    
    /*
    console.log(this);
    console.log(Template.parentData(1));
    console.log(Template.parentData(2));
    this.name = Maailmanparannus
    this._id = issue id
    
    Template.parentData(1).name = issues
    Template.parentData(1).mode = view
    Template.parentData(1).cl = skitSocieties
    
    Template.parentData(2).name = "Yhteiskunnan nimi";
    Template.parentData(2)._id = id of society;
    */
    
    // Get schema
    var schemaName = Template.parentData(1).cl;
    var schema = skitRelations.schemas[ schemaName ].def;
//     console.log("schemaName="+schemaName);
    
    // Schema not defined yet?
    if( !schema ) {
//       console.log("Schema not defined yet. Return no relation fields.");
      return [];
    }
//     console.log("schema.def:", EJSON.stringify(schema));
    
    var field = schema[Template.parentData(1).name];
//     console.log("field of schema.def:", EJSON.stringify(field));
    
    var formSchema = skitRelations.schemas[ schemaName ].form;
    if( formSchema === undefined ) {
      formSchema = skitRelations.getFormSchema( schemaName )();
    }
//      console.log("getViewFields! formSchema=" + EJSON.stringify(formSchema));
    
    
    // Go through each field in the form schema
    var relationFields = [];
    for( var fieldName in formSchema ) {
      var analyzedField = analyzeString( fieldName );
      
//       console.log( "analyzedField("+fieldName+") = " + EJSON.stringify(analyzedField));
//       console.log("parent.name="+Template.parentData(1).name);
      if( analyzedField.relation && analyzedField.fieldName
            === Template.parentData(1).name ) {
        
        var context = {
          name: fieldName,
          originalName: analyzedField.attr.name,
          label: formSchema[fieldName].label,
          cl: analyzedField.cl,
          relationType: analyzedField.relationType,
          relationId: analyzedField.relationIndex
        };
        
        relationFields.push( context );
      }
    }
    
//     console.log("skitRelations :: getViewFields: Return relationFields: " + EJSON.stringify(relationFields));
    return relationFields;
  },
  
  getFieldLabel: function () {
      return this.label;
  },
  getFieldContent: function () {
    return Template.parentData(1)[this.originalName];
  }
   
});







  
  // Set up a form so that it's able to fetch and create the relations
  skitRelations.setForm = function( formId, setFormCollection, type ) {
//     console.log(setFormCollection, type);
              
    var hooks = {};
    hooks[formId] = {
        
        // Called when form does not have a `type` attribute
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
          var cl = setFormCollection;
              
          switch(type) {
            
            case "insert":
//               console.log("onSubmit: insert, doc="+EJSON.stringify( insertDoc ));
//               console.log(setFormCollection, type);
              
              // Collect here all data to be inserted
              var items = {};
              var relations = [];
              
              // Function for recursive operation
              var createDocsAndRels = function ( meAnalyzed, myId, myCl, fieldName ) {
//                 console.log("Process analyzed field: "
//                   + EJSON.stringify(meAnalyzed), myId, myCl );
                
                // Own field?
                if( !meAnalyzed.relation ) {
                  // Object for the item if it hasn't been created by an earlier
                  // form field processing
                  if( typeof items[ myCl ] === "undefined" ) {
                    items[ myCl ] = {};
                  }
                  
                  // Create item's data holder if needed
                  if( typeof items[ myCl ][ myId ] === "undefined" ) {
                    items[ myCl ][ myId ] = {};
                  }
                  
                  // Insert the data of the field
                  items[myCl][myId][ meAnalyzed.name ] = insertDoc[ fieldName ];
                  
//                   console.log("Insert own field: ", myCl, myId, meAnalyzed.name );
                }
                
                // Relation field?
                else {
                  
                  // Object for the related item if it hasn't been created by an earlier
                  // form field processing
                  if( typeof items[ meAnalyzed.cl ] === "undefined" ) {
                    items[ meAnalyzed.cl ] = {};
                  }
                  
                  // Create relation item id
                  if( typeof items[ meAnalyzed.cl ][ meAnalyzed.relationIndex ]
                      === "undefined" ) {
                    items[ meAnalyzed.cl ][ meAnalyzed.relationIndex ] = {};
                  }
                  
                  // Analyze this field further
                  createDocsAndRels( meAnalyzed.attr, meAnalyzed.relationIndex,
                                     meAnalyzed.cl, fieldName );
                  
                  // Add the relation to be inserted
                  relations.push({
                    relationType: meAnalyzed.relationType,
                    cl1: myCl,
                    id1: myId,
                    cl2: meAnalyzed.cl,
                    id2: meAnalyzed.relationIndex
                  });
                }
              }
              
              // Get data of each form field and insert to item
              for( var field in insertDoc ) {
                var analyzed = analyzeString( field );
                createDocsAndRels( analyzed, "SELF", cl, field );
              }
              
              // Now data for all items and relations has been organized from
              // the form fields.
              
              // Insert the items (or get their id's
//               console.log(items);
              for( var cl in items ) {
                for( var id in items[cl] ) {
                  
//                   console.log("Inserting item to collection " + cl + ", "+
//                               "with id="+id);
                  
                  // Exists already?
                  var ex = skitRelations.schemas[cl].db.findOne( items[cl][id] );
                  if( ex && id !== "SELF" ) {
//                     console.log("Exists already, id="+ ex._id);
                    
                    // Save the _id of this existing item to be used in rel's
                    items[cl][id]._id = ex._id;
                  }
                  // This is a new item?
                  else {
//                     console.log("Doesn't exist, so inserted cl:"+cl+", item="+
//                       EJSON.stringify(items[cl][id]));
                    
                    // Insert the item to collection
                    items[cl][id]._id
                      = skitRelations.schemas[cl].db.insert(items[cl][id] );
                  }
                }
              }
              
              // Insert the relations
              for( var rel in relations ) {
                
                // Use real _id:s
                relations[rel].id1 = items[relations[rel].cl1][relations[rel].id1]._id;
                relations[rel].id2 = items[relations[rel].cl2][relations[rel].id2]._id;
                
                // Get relation type id
                var relType = exists({
                  relationType: relations[rel].relationType,
                  cl1: {
                    cl: relations[rel].cl1,
                    id: relations[rel].id1,
                  },
                  cl2: {
                    cl: relations[rel].cl2,
                    id: relations[rel].id2,
                  }
                });
                
                // Exists already?
                var ex = Relations.findOne({
                  relationType: relType.id,
                  id1: relType.cl1.id,
                  id2: relType.cl2.id
                });
                
                // Doesn't exist?
                if( !ex ) {
                  // Insert the relation
                  Relations.insert({
                    relationType: relType.id,
                    id1: relType.cl1.id,
                    id2: relType.cl2.id
                  });
                }
              }
              
//               console.log("Inserted the items and relations successfully!");
              
              break;
              
              
            default: 
              break;
          }
          
          
          
          // Insert those items if needed
          
          
          // Insert relations
          
          /*
          var society = {name: insertDoc.name};
          var issue = {name: insertDoc.issue};
          
          var societyId = skitSocieties.db.insert(society);
          var issueId = skitIssues.db.insert(issue);
          */
          //db.insert(relationTypeId, societyId, issueId);
          
          
          
          this.done(); // submitted successfully, call onSuccess
          //this.done(new Error('foo')); // failed to submit, call onError with the provided error
          //this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
          
          return false;
        }
      }
    AutoForm.hooks(hooks);
    
  }










}
/////////////////////// OLD STUFF /////////////////////


/*
// Code for creating a new input type is taken and modified from:
// https://github.com/aldeed/meteor-autoform/tree/master/inputTypes/select-multiple

AutoForm.addInputType("skitRelation2",{
  template: "skitRelation",
  
  // Give the current value to the template
  valueIn: function () {
    return {
      isNew: false,
      id: "xyz",
      newItem: {
        name: "name",
        otherShortData: "x"
      }
    };
  },
  
  // TODO: Not needed?
  valueIsArray: true,
  
  valueOut: function () {
    var val = [];
    
    // Create a value: [ "id123", {name: "newItem"}, {name: newItem2}, "id456", ... ]
    // String = existing item, Object = new item
    
    // TODO: Get data from the already selected non-text-input elements
    this.find('input[type=text]').each(function () {
      val.push($(this).val());
    });
    
    return val;
  },
  
  contextAdjust: function (context) {
    
    var itemAtts = _.omit( context.atts );
    
    // build items list
    context.items = [];
    
    // Add all defined options
    _.each(context.selectOptions, function(opt) {
      
      context.items.push({
        name: context.name,
        label: opt.label,
        value: opt.value,
        // _id must be included because it is a special property that
        // #each uses to track unique list items when adding and removing them
        _id: opt.value,
        selected: (_.contains(context.value, opt.value)),
        atts: itemAtts
      });
    });
    
    return context;
  }
  
});


Template.skitRelation2.helpers({
  selectOne: function () {
  // Returns whether to create a form widget for selecting one or multiple items
    
    // TODO: Get relation type's count1max/count2max here
    // to see whether to return true or false
    //this.atts
    
    return true;
  },
  
  collection: function () {
    // TODO: How to get the name of the collection from the relation type specs
    return Issues.find().fetch().map(function(it){
      
      // Which attributes to give: depends on relation type specs!
      return it.name;
    });
  },
  
  isNew: function () {
    
    // TODO: Find whether this item exists already or not
    //return "checked";
    return "";
  },
  
  atts: function selectedAttsAdjust() {
    var atts = _.clone(this.atts);
    if (this.selected) {
    atts.checked = "";
    }
    // remove data-schema-key attribute because we put it
    // on the entire group
    delete atts["data-schema-key"];
    return atts;
  },
  dsk: function dsk() {
    console.log("skit:relations :: Template.dsk: this=");
    console.log( this );
    return {
      "data-schema-key": this.atts["data-schema-key"]
    }
  }
  
});
*/




/*
  skitRelations.getFormSchema = function ( schema ) {
  /*
  Operation:
    Turns "relation" typed attributes of the schema into the schemas of
    the related schema.
  *//*
    var log = "skit:relations :: getFormSchema :: ";
    
    // First, create a copy of the schema
    var mySchema = $.extend({}, schema );
    var result = {};
    
    console.log( log + "My schema: " + EJSON.stringify( mySchema ) );
    
    
    // Go through all 'relation' fields in the schema
    var relationCounter = 1;
    for( var attr in mySchema ) {
      
      // Normal, non-relation field of schema?
      if( mySchema[attr].type !== "relation" ) {
        
        // Just add the field to the result
        result[attr] = mySchema[attr];
      }
      
      // Relation field?
      else {
        
        // Turn this attr into attrs of the relation target
        var schemaRelated = skitRelations.getFormSchema( Schemas[ mySchema[attr].clTo ] );
        
        
        // Get relation type specs
        var relationType = skitRelations.types.find({
          type: mySchema[attr].relationType,
          cl1: mySchema[attr].clFrom,
          cl2: mySchema[attr].clTo
        });
        if( include.count() < 1 ) {
          relationType = skitRelations.types.find({
            type: mySchema[attr].relationType,
            cl1: mySchema[attr].clTo,
            cl2: mySchema[attr].clFrom
          });
        }
        
        // What attrs to include
        
        /*
        
  cl1: "societies",
  attrs1: "name",
  count1min: 0,
  count1max: Infinity,
  
  type: "concerns",
  
  cl2: "issues",
  attrs2: "name",
  count2min: 1,
  count2max: Infinity
});
        
        
        
  issues: {
    type: "relation",
    label: "Issues",
    
    
    clFrom: "societies",
    relationType: "relatedTo",
    clTo: "issues"
  },
  
  
  issues: {
    type: [Object],
    label: "Issues",
    
  }
    */    /*
        // Add each field to schema
        for( var attrRelated in schemaRelated ) {
          
          // relation1issuesATTRname
          var attrRenamed = "relation" + relationCounter + mySchema[attr].clTo
            + "ATTR" + attrRelated;
          result[attrRenamed] = schemaRelated[attrRelated];
        }
        
        // Added one relation
        relationCounter++;
      }
    }
    
    console.log(log + "Return: " + EJSON.stringify(result));
    return result;
  }
  
  
  
  
 */ 

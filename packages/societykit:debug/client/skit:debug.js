SimpleSchema.debug = true;
AutoForm.debug();




Template.skitDebug.helpers({
  context: function (depth) {
    if( typeof depth === "undefined" ) {
      depth = 3;
    }
    console.log("DEBUG CONTEXT!");
    
    var result = [];
    console.log( this );
    result.push({ name: "this", keys: EJSON.stringify(Object.keys(this)) });
    console.log( depth );
      
    for( var i = 0; i < depth; i++ ) {
      console.log( "i="+i);
      // Create name = "../../../" (eg. for depth=3)
      var name = "";
      for( var j = 0; j < i; j++) {
        name += "../";
      }
      
      /*
      // Create variable key-value pairs
      var variables = [];
      for( var j in Template.parentData(i) ) {
        variables.push({key: j, value: EJSON.stringify(Template.parentData(i)[j]) });
      }
      
      // Add data to result array
      result.push({name: name, variables: variables });
      */
      result.push({name: name, variables: 
        "xx" // Template.parentData(i)
      });
      
      console.log( Template.parentData(i) );
    }
    
    console.log(EJSON.stringify(result));
    
    return result;
  },
  
  
  toConsole: function () {
    var log = "skit:debug :: ";
    
    var depth = this.depth;
    if( typeof depth === "undefined" ) {
      depth = 5;
    }
    
    var name = this.name;
    if( typeof name === "undefined" ) {
      name = "SOME ELEMENT";
    }
    console.log( log + "CONTEXT OF " + name.toUpperCase() + " (this + parents 1-"+depth+"):" );
    
    // Start from 1 because 0 is the skitDebug template
    for( var i = 0; i < depth+1; i++ ) {
      if( i === 0 ) {
        var parent = "this";
      }
      else {
        var parent = "Parent "+(i);
      }
      console.log(Template.parentData(i+1));
    }
    
    console.log(log + "END OF CONTEXT OF " + name.toUpperCase() );
    return "";
  }
  
});


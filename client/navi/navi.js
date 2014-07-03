//////////////////////////// ELEMENT: NAVI ////////////////////////////
// * * * CREATE OBJECT
Navi = {};
Navi.item = {};
console.log("Navi::constructor   Object created.");


/*
  Navigation bar.
  
*/



//////////////////////////// MODEL ////////////////////////////
/*


*/

// * * * DATABASE COLLECTION

// Database data not received yet?
Navi._loading = true;

Navi.Navis = new Meteor.Collection("navis");
Deps.autorun(function () {
  // Subscribe for the default navi
  Meteor.subscribe("navis", ["default"], function() {
    var self = Navi;
    console.log( "Navi::subscribe   Received: " + EJSON.stringify( Navi.Navis.find().fetch() ) );
    self._loading = false;
  });
});

// * * * INITIALIZE
Meteor.startup(function(){
});



//////////////////////////// VIEW ////////////////////////////
// * * * TEMPLATE
Navi.template = Template.navi;
Navi.template.item = Template.naviItem;

Navi.template.helpers({});

/*
[
  {
    title: 
    action: 
    tooltip: 
    children: [
      ...,
      ...
    ]
  },
  ...
]

*/
Template.navi.items = function (naviId) {
  var self = Navi;
  
  console.log("Navi::template::items   naviId="+EJSON.stringify(naviId));
  if( typeof naviId === "undefined" ) {
    naviId = "default";
  }
  
  // Get the navi
  var navi = self.Navis.findOne({id:naviId});
  console.log("Navi::template::items   navi=" + EJSON.stringify(navi));
  
  if( !!navi && !!navi.before && !!navi.after ) {
    
    // Combine before, pages and after
    var combined = navi.before.concat(navi.pages).concat(navi.after);
    
    // Return the result
    return combined;
  }
  else {
    if( self._loading ) {
      return [{title:"Loading navi...",tooltip:"If the navi won't load, there is a problem on the website. We apologize."}];
    }
    else {
      return [];
    }
  }
}

Session.setDefault("naviSelected","{}")
Navi.template.item.attr = function ( attr ) {
  var self = Navi;
  
  // TODO Get naviId somehow here.
  var naviId = "default";
  if( typeof naviId === "undefined" ) {
    naviId = "default";
  }
  
  switch( attr ) {
    case "id":
      if( this["id"] ) {
        //console.log("Navi::template::item::attr   attr="+attr+", return \""+this["id"]+"\"");
        return this["id"];
      }
      break;
      
    case "class":
      if( this["class"] ) {
        //console.log("Navi::template::item::attr   attr="+attr+", return \""+this["class"]+"\"");
        return this["class"];
      }
      break;
      
    case "selected":
      var selectedType = self._isSelected( this.id, naviId );
      if( selectedType ) {
        return selectedType;
      }
      else {
        return "";
      }
      break;
      
    case "tooltip":
      if( this["tooltip"] ) {
        //console.log("Navi::template::item::attr   attr="+attr+", return \""+this["tooltip"]+"\"");
        return this["tooltip"];
      }
      break;
      
    default:
      console.log("Navi::template::item::attr   attr="+attr+", invalid parameter attr, return \"\"");
      return "";
  }
  console.log("Navi::template::item::attr   No attribute "+attr+" is specified for the navi item "+this["id"]+", return \"\"");
  return null;
}

Navi.template.item.tooltip = function () {
  return " title='" + this.tooltip + "'";
}

Navi.template.item.showChildren = function () {
  var self = Navi;
  
  // TODO Get naviId somehow.
  var naviId = "default";
  if( typeof naviId === "undefined" ) {
    naviId = "default";
  }
  
  var selectedType = self._isSelected( this.id, naviId );
  
  // Has children and is selected
  return ( this.children && this.children.length && ( !!selectedType ) );
}


Navi._isSelected = function(id, naviId) {
  var selected = EJSON.parse( Session.get("naviSelected") );
  
  // TODO Get naviId somehow.
  if( typeof naviId === "undefined" ) {
    naviId = "default";
  }
  
  console.log("Navi::_isSelected   id="+id+", selected items="+EJSON.stringify(selected)+"("+(typeof selected)+")");
  
  // No selected items have been set for this navi yet?
  if( typeof selected[naviId] === "undefined" ) {
    console.log("Navi::template::item::attr   Selected items have not been set for this navi yet. Return \"\".");
    return "";
  }
  
  // Is the first item on the list?
  if( selected[naviId][0] === id ) {
    
    // It is the selected item
    return "selected";
  }
  
  // Is a parent of the selected item?
  for( var i = 1; i < selected[naviId].length; i++ ) {
    if( selected[naviId][i] === id ) {
      return "selectedParent";
    }
  }
  
  return false;
}



// * * * EVENTS
Navi.template.events({});


Navi.template.item.events({
  
  'click .naviItemAction' : function () {
    eval( this.action );
    console.log( "Navi::template::item::events::.naviItemAction   Clicked navi:"+this.id );
  }
  
});



//////////////////////////// CONTROLLER ////////////////////////////
// * * * OWN VARIABLES

Navi._findSelected = function (item, page, naviId, result) {
  var self = Navi;
  console.log("Navi::_findSelected   item="+EJSON.stringify(item) + ", page="+page+", naviId="+naviId );
  
  // Is this selected?
  if( item.id === page ) {
    // Set selected
    result[ naviId ] = [page];
    console.log("Navi::_findSelected   Selected item found: "+item.id+". Now result="+EJSON.stringify(result));
    return true;
  }
  
  // Is not selected:
  else {
    // Has children?
    var childIsSelected = false;
    if( typeof item.children !== "undefined" ) {
      console.log("Navi::_findSelected   Go through "+item.children.length+" children.");
    
      // Go through children...
      for( var iChild = 0; iChild < item.children.length; iChild++ ) {
        childIsSelected = ( childIsSelected || self._findSelected( item.children[iChild], page, naviId, result ) );
      }
      
      // Is one of them selected?
      if( childIsSelected ) {
        
        // Add to the parent chain
        result[ naviId ].push( item.id );
        console.log("Navi::_findSelected   "+item.id+" is a parent of the selected. Now result["+naviId+"]="+EJSON.stringify(result[naviId]));
        return true;
      }
    }
    
    // No child is selected?
    if( !childIsSelected ) {
      console.log("Navi::_findSelected   "+item.id+" is not the selected nor a parent of the selected.");
      // This navi item nor any of its grandchildren is selected
      return false;
    }
  }
}


// * * * INTERFACE FOR OTHER ELEMENTS
//Navi.fn = function () {...}











// * * * CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  console.log( "Navi::startup" );
  
  
  // Computation: Updates when navi structure changes or the selected Page changes
  Navi.computation = Deps.autorun(function() {
    
    var self = Navi;
    var result = {};
    
    // Get navi structures and current page
    var navis = self.Navis.find().fetch();
    var page = Page.getPage();
    
    console.log("Navi::computation::autorun   page="+EJSON.stringify(page));
    
    
    // Go through all navis
    for( var iNavi = 0; iNavi < navis.length; iNavi++ ) {
      
      // Initialize empty
      console.log("Navi::computation::autorun   naviId="+EJSON.stringify(navis[iNavi].id));
    
      result[ navis[iNavi].id ] = [];
      
      // Go through all navi item groups
      var groups = ["before","pages","after"];
      for( var iGroup = 0; iGroup < groups.length; iGroup++ ) {
        console.log("Navi::computation::autorun   group="+EJSON.stringify(groups[iGroup]));
        
        // Go through all items in the group
        for( var iItem = 0; iItem < navis[iNavi][ groups[iGroup] ].length; iItem++ ) {
          console.log("Navi::computation::autorun   item id="+EJSON.stringify(navis[iNavi][ groups[iGroup] ][iItem].id));
          self._findSelected( navis[iNavi][ groups[iGroup] ][iItem], page, navis[iNavi].id, result );
        }
      }
    }
    
    Session.set("naviSelected", EJSON.stringify(result));
    console.log("Navi::computation::autorun   Finished with result="+EJSON.stringify(result));
  });
});



//Object.seal(Navi);
//////////////////////////// END OF FILE ////////////////////////////

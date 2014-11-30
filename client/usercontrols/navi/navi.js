//////////////////////////// ELEMENT: NAVI ////////////////////////////
/*
Navigation bar.
*/
Navi = {};
Navi.item = {};

//////////////////////////// MODEL ////////////////////////////
//// CREATE DATABASE COLLECTION
// Database data not received yet?
Navi._loading = true;

// Create collection for the contents of the navigation bar
Navi.Navis = new Meteor.Collection("navis");

//Tracker.autorun(function () {
  // Subscribe for the default navi
  Meteor.subscribe("navis", ["default"], function() {
    Navi._loading = false;
  });
//});

//// INSERT INITIAL DATA
//Meteor.startup(function(){});


//////////////////////////// VIEW ////////////////////////////
// TEMPLATE
Navi.template = Template.navi;
Navi.template.item = Template.naviItem;

Navi.template.helpers({});

/* Data fields of a navi item:
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
Navi.template.helpers({
  items: function (naviId) {
    
    // Take the default value for naviId if none is given
    if( typeof naviId === "undefined" ) {
      naviId = "default";
    }
    
    // Get the navi
    var navi = Navi.Navis.findOne({id:naviId});
    
    if( !!navi && !!navi.before && !!navi.after ) {
      
      // Combine before, pages and after
      var combined = navi.before.concat(navi.pages).concat(navi.after);
      
      // Return the result
      return combined;
    }
    else {
      if( Navi._loading ) {
        return [{title:"Loading...",tooltip:"If the navi won't load, there is a problem on the website."}];
      }
      else {
        return [];
      }
    }
    
  }
});

Session.setDefault("naviSelected","{}")
Navi.template.item.helpers({
  attr: function ( attr ) {
    // TODO Get naviId here somehow.
    var naviId = "default";
    if( typeof naviId === "undefined" ) {
      naviId = "default";
    }
    
    switch( attr ) {
      case "id":
        if( this["id"] ) {
          return this["id"];
        }
        break;
        
      case "class":
        if( this["class"] ) {
          return this["class"];
        }
        break;
        
      case "selected":
        var selectedType = Navi._isSelected( this.id, naviId );
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
    return null;
  },
  
  tooltip: function () {
    return " title='" + this.tooltip + "'";
  },

  showChildren: function () {
    // TODO Get naviId somehow.
    var naviId = "default";
    if( typeof naviId === "undefined" ) {
      naviId = "default";
    }
    
    var selectedType = Navi._isSelected( this.id, naviId );
    
    // Has children and is selected
    return ( this.children && this.children.length && ( !!selectedType ) );
  }
  
});


Navi._isSelected = function(id, naviId) {
  var selected = EJSON.parse( Session.get("naviSelected") );
  
  // TODO Get naviId somehow.
  if( typeof naviId === "undefined" ) {
    naviId = "default";
  }
  
  // No selected items have been set for this navi yet?
  if( typeof selected[naviId] === "undefined" ) {
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



//////// EVENTS
//Navi.template.events({});

Navi.template.item.events({
  'click .naviItemAction' : function () {
    eval( this.action );
    //console.log( "Navi::template::item::events::.naviItemAction: Clicked a navi item:"+this.id );
  }
});



//////////////////////////// CONTROLLER ////////////////////////////
//// OWN VARIABLES
Navi._findSelected = function (item, page, naviId, result) {
  // Is this selected?
  if( item.id === page ) {
    // Set selected
    result[ naviId ] = [page];
    return true;
  }
  
  // Is not selected:
  else {
    
    // Has children?
    var childIsSelected = false;
    if( typeof item.children !== "undefined" ) {
      
      // Go through children...
      for( var iChild = 0; iChild < item.children.length; iChild++ ) {
        childIsSelected = ( childIsSelected || Navi._findSelected( item.children[iChild], page, naviId, result ) );
      }
      
      // Is one of them selected?
      if( childIsSelected ) {
        
        // Add to the parent chain
        result[ naviId ].push( item.id );
        return true;
      }
    }
    
    // No child is selected?
    if( !childIsSelected ) {
      // This navi item nor any of its grandchildren is selected
      return false;
    }
  }
}

//// INTERFACE FOR OTHER ELEMENTS
//Navi.fn = function () {...}

//// CONNECT TO OTHER ELEMENTS
Meteor.startup(function(){
  // Computation: Updates when navi structure changes or the selected Page changes
  Navi.computation = Tracker.autorun(function() {
    var result = {};
    
    // Get navi structures and current page
    var navis = Navi.Navis.find().fetch();
    var page = Page.getPage();
    
    // Go through all navis
    for( var iNavi = 0; iNavi < navis.length; iNavi++ ) {
      
      // Initialize empty
      result[ navis[iNavi].id ] = [];
      
      // Go through all navi item groups
      var groups = ["before","pages","after"];
      for( var iGroup = 0; iGroup < groups.length; iGroup++ ) {

        // Go through all items in the group
        for( var iItem = 0; iItem < navis[iNavi][ groups[iGroup] ].length; iItem++ ) {
          Navi._findSelected( navis[iNavi][ groups[iGroup] ][iItem], page, navis[iNavi].id, result );
        }
      }
    }
    
    Session.set("naviSelected", EJSON.stringify(result));
  });
});


//////////////////////////// END OF FILE ////////////////////////////
// Session variables

// Show the main menu (the front page)
Session.setDefault("skitMenu", true);
Session.set("skitMenuOverlay", "skitMenuOverlayFront");
skitSession.registerCallback( "skitMenu", function( oldValue, newValue ){
  
  // Show menu?
  if( newValue === true ) {
    
    // Show menu
    $('.skitMenu')
      .sidebar('setting','transition','overlay')
      .sidebar('show')
    ;
    
    // Show overlay
    $(".skitMenuOverlay").fadeIn();
    
  }
  
  // Hide menu?
  else {
    // Hide menu
    $('.skitMenu')
      .sidebar('setting','transition','overlay')
      .sidebar('hide')
    ;
    
    // Hide overlay
    $(".skitMenuOverlay").fadeOut();
  } 
  
});


Template.skitMenu.helpers({
  overlay: function () {
    return Session.get("skitMenuOverlay");
  }
});

Template.skitMenuContents.helpers({
  pageMenu: function () {
    return Session.get("skitPage")+"Menu";
  }
});


Meteor.startup(function(){
  $('.skitMenu')
    .sidebar('setting','transition','overlay')
    .sidebar('setting','closable',false)
    .sidebar('setting','dimPage',false)
    .sidebar('setting','scrollLock',false)
  ;
});
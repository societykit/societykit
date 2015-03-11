// Session variables

// Show the main menu (the front page)
Session.setDefault("mainMenu", true);

// Which page is shown?
Session.setDefault("mainPage", "home");
Meteor.startup(function(){
  Url.register({
    name: "mainPage",
    title: "",
    defaultValue: "home",
    values: [
      {
        value: "home",
        text: ""
      },
      {
        value: "about",
        text: "about"
      },
      {
        value: "contact",
        text: "contact"
      }
    ]
  });
});


// Helpers
Template.body.helpers({
  
  page: function () {
  // Returns the page template of the currently selected page.
    
    var current = Session.get("mainPage");
    return current;
    // "page" + current.charAt(0).toUpperCase() + current.slice(1);
  }
  
});


Template.body.events({
  "click #societykitOpenMenu": function () {
    
    // TODO: Change the Session("mainMenu") with {{sessionSet ...}} blocks instead
    // of using these custom events.
    // Set the session state
    Session.set("mainMenu", true);
    
    // Show front image
    $("#societykitFront").fadeTo(400, 1.0);
    
    // Show menu
    $('.mainMenu')
      .sidebar('setting','transition','overlay')
      .sidebar('show')
    ;
  },
  
  "click #societykitFront .explore": function () {
    // Set the session state
    Session.set("mainMenu", false);
    
    // Hide menu
    $('.mainMenu')
      .sidebar('setting','transition','overlay')
      .sidebar('hide')
    ;

    // Hide front image
    $("#societykitFront").fadeOut();
  },
  
  // TODO: Why doesn't this work?
  "click .mainMenu .societykitLogo": function () {
    // (COPY-PASTED FROM ABOVE)
    // Set the session state
    Session.set("mainMenu", false);
    
    // Hide menu
    $('.mainMenu')
      .sidebar('setting','transition','overlay')
      .sidebar('hide')
    ;
    
    // Hide front image
    $("#societykitFront").fadeOut();
  }
  
});

/*
// showing multiple
$('.visible .ui.sidebar')
  .sidebar({
    context: '.visible .bottom.segment'
  })
  .sidebar('hide')
;*/

Meteor.startup(function(){
  
  $('.mainMenu')
    .sidebar('setting','transition','overlay')
    .sidebar('setting','closable',false)
    .sidebar('setting','dimPage',false)
    .sidebar('setting','scrollLock',true)
  ;
  
  // The main menu (front page) is open?
  if( Session.get("mainMenu") ) {
    $('.mainMenu').sidebar('toggle');
  }
  else {
    // Hide the image
    $("#societykitFront").hide();
  }
  
  // Initialize checkboxes & dropdowns
  $('.ui.checkbox')
    .checkbox()
  ;
  $('.ui.dropdown')
    .dropdown()
  ;
    
});


// Session variables

// Which page is shown?
skitSession.setDefault("skitPage", "home");
/*Meteor.startup(function(){
  Url.register({
    name: "skitPage",
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
});*/


// Helpers
Template.body.helpers({
  
  page: function () {
  // Returns the page template of the currently selected page.
    var current = Session.get("skitPage");
    return current;
    // "page" + current.charAt(0).toUpperCase() + current.slice(1);
  }
});


Meteor.startup(function(){
  
  // Initialize checkboxes & dropdowns
  $('.ui.checkbox').checkbox();
  $('.ui.dropdown').dropdown();
});


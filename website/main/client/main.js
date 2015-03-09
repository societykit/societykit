// Session variables
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
  
  pageTemplate: function () {
    var current = Session.get("mainPage");
    return current;
    // "page" + current.charAt(0).toUpperCase() + current.slice(1);
  }
  
});


Template.header.helpers({
  active: function () {
    Session.get("mainPage");
    
    return
  }
});



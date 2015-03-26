Template.skitAbout.rendered = function () {
  $('.skitAbout .ui.accordion').accordion();
}

skitSession.setDefault("skitAbout", "skitAboutFront");

Template.skitAbout.helpers({
  aboutPage: function () {
    return Session.get("skitAbout");
  }
});

Template.skitAboutNext.helpers({
  nextPageTemplate: function () {
    switch(Session.get("skitAbout")) {
      case "skitAboutFront": return "skitAboutCitizen";
      case "skitAboutCitizen": return "skitAboutCompany";
      default: return "skitAboutFront";
    }
  },
  
  nextPageTitle: function () {
    switch(Session.get("skitAbout")) {
      case "skitAboutFront": return "1.1 Citizen";
      case "skitAboutCitizen": return "1.2 Company";
      default: return "1. Society Kit";
    }
  }
});
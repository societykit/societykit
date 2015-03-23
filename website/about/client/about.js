Template.skitAbout.rendered = function () {
  $('.skitAbout .ui.accordion').accordion();
}

skitSession.setDefault("skitAbout", "skitAboutEasyWayToChange");

Template.skitAbout.helpers({
  aboutPage: function () {
    return Session.get("skitAbout");
  }
});
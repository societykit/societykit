Session.setDefault("society",undefined);
Session.setDefault("societyCreate",false);

Template.home.helpers({
  getSocieties: function() {
    return skitSocieties.db.find({},{sort:["name","asc"]});
  },
  getIssues: function() {
    return skitIssues.db.find();
  }
});
  
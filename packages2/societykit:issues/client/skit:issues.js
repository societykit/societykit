if (Meteor.isClient) {

  // Subscribe to database
Meteor.subscribe("skitIssues");

// Template helpers to get db and schema
Template.societiesInsert.helpers({
  db: skitIssues.db,
  schema: skitRelations.getFormSchema("skitIssues")
});
//skitRelations.setForm("societiesInsertForm");

}
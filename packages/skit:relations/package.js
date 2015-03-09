Package.describe({
  name: 'skit:relations',
  version: '0.0.1',
  
  // Brief, one-line summary of the package.
  summary: 'Add relations between collections in autoForm.',
  
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/societykit/relations',
  
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  
  // Dependencies
  api.use([
    'aldeed:simple-schema',
    'aldeed:collection2',
    'aldeed:autoform@5.0.0',
    'sergeyt:typeahead'
  ]);
  api.use('jquery', 'client');
  
  api.use([
    'templating',
    'ejson',
    'livedata'
  ]);
  api.imply([
    'templating',
    'livedata'
  ]);
  
  // Exports
  api.export("skitRelations");
  //api.export("Schemas");
  
  // Files
  api.addFiles('lib/skit:relations.js');
  api.addFiles([
    'client/skit:relations.css',
    'client/skit:relations.html',
    'client/skit:relations.js'
    ], "client");
  api.addFiles('server/skit:relations.js', "server");
  
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('skit:relations');
  api.addFiles('skit:relations-tests.js');
});

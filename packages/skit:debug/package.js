Package.describe({
  name: 'skit:debug',
  version: '0.0.1',
  
  // Brief, one-line summary of the package.
  summary: 'Helpers for debugging.',
  
  // URL to the Git repository containing the source code for this package.
  git: '',
  
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  
  // Set dependencies
  api.use([
    'templating',
    'aldeed:autoform',
    'aldeed:simple-schema'
  ]);
  api.imply('templating');
  
  
  // Export interface to package users
  api.export("skitDebug");
  
  // Add files
  api.addFiles([
    'client/skit:debug.html',
    'client/skit:debug.css',
    'client/skit:debug.js'
    ], 'client' );
  api.addFiles('server/skit:debug.js', 'server');
});


Package.onTest(function(api) {
  api.use('tinytest');
  api.use('skit:debug');
  api.addFiles('skit:debug-tests.js');
});

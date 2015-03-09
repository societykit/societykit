/*
PACKAGE: SOCIETYKIT:URL

Interface:
- Url.register()

Responsibilities:
- Sets the url string according to the values of registered state variables
- Sets the registered state variables according to the url string when it changes
  
*/
Package.describe({
  name: 'societykit:url',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'URL corresponding to selected session variables.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.addFiles('client/societykit:url.js', 'client');
  api.export("Url", "client");
  api.use(['backbone', 'ejson'], 'client');
  
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('societykit:url');
  api.addFiles('societykit:url-tests.js');
});

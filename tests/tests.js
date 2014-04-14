var tests = {};
var win = {
  'location': {
    'host': 'example.com',
    'protocol': 'http:',
    'pathname': '/',
    mockupReset: function() {
      this.pathname = '/';
      this.protocol = 'http:';
      this.host = 'example.com';
    }
  },
  'navigator': {}
};

win.navigator.mozApps = require('./mozApps-mockup');

var AppInstall = require('../src/AppInstall');
AppInstall.setupMockups(win);


/*
  guessManifestPath: guessManifestPath,
  isInstalled: isInstalled,
  isInstallable: isInstallable
  install: install,
*/

tests.isInstallable = function(test) {
  test.expect(1);

  test.ok(AppInstall.isInstallable() === true);
  test.done();
};


tests.guessManifestPath = function(test) {
  test.expect(5);

  var manifestFile = 'manifest.webapp';

  win.location.pathname = '/';
  test.equals(AppInstall.guessManifestPath(), 'http://example.com/' + manifestFile);
  
  win.location.pathname = '/example';
  test.equals(AppInstall.guessManifestPath(), 'http://example.com/example/' + manifestFile);

  win.location.protocol = 'https:';
  win.location.pathname = '/';
  test.equals(AppInstall.guessManifestPath(), 'https://example.com/' + manifestFile);

  win.location.host = 'example.org';
  test.equals(AppInstall.guessManifestPath(), 'https://example.org/' + manifestFile);

  win.location.host = 'example.org:8080';
  test.equals(AppInstall.guessManifestPath(), 'https://example.org:8080/' + manifestFile); 

  test.done();
};


tests.checkInstalledWorks = function(test) {
  test.expect(1);

  win.location.mockupReset();

  var manifestPath = AppInstall.guessManifestPath();

  win.navigator.mozApps.mockupCheckInstalledFails = false;

  AppInstall.isInstalled(manifestPath, function(error, result) {
    test.ok(error === false);
    test.done();
  });
};


tests.checkInstalledError = function(test) {
  test.expect(2);

  win.location.mockupReset();

  var manifestPath = AppInstall.guessManifestPath();

  win.navigator.mozApps.mockupCheckInstalledFails = true;

  AppInstall.isInstalled(manifestPath, function(error, result) {
    test.ok(error !== false);
    test.equals(typeof error, 'string');
    test.done();
  });
};


tests.checkInstalledAppNotInstalled = function(test) {
  test.expect(1);

  win.location.mockupReset();

  var manifestPath = AppInstall.guessManifestPath();

  win.navigator.mozApps.mockupCheckInstalledFails = false;
  win.navigator.mozApps.mockupAppIsInstalled = false;

  AppInstall.isInstalled(manifestPath, function(error, result) {
    test.equals(result, false);
    test.done();
  });
};


tests.checkInstalledAppIsInstalled = function(test) {
  test.expect(1);

  win.location.mockupReset();

  var manifestPath = AppInstall.guessManifestPath();

  win.navigator.mozApps.mockupCheckInstalledFails = false;
  win.navigator.mozApps.mockupAppIsInstalled = true;

  AppInstall.isInstalled(manifestPath, function(error, result) {
    test.equals(result, true);
    test.done();
  });
};



module.exports = tests;

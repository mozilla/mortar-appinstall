/*
 * `navigator.mozApps` doesn't necessarily exist where you run the tests, and also
 * it's convenient to "fake" this behaviour without actually installing apps.
 * This is modelled to behave like described here:
 * https://developer.mozilla.org/en-US/docs/Web/API/Apps
 */

var mozApps = {
  mockupCheckInstalledFails: false,
  mockupAppIsInstalled: false,
  mockupAppWillBeInstalled: true
};


function FakeDOMRequest() {
  this.readyState = 'pending';
  this.shouldFail = false;

  this.onerror = function() {
  };

  this.onsuccess = function() {
  };

  this.execute = function() {

    this.readyState = 'done';
    
    if(this.shouldFail) {
      this.error = {
        name: 'Failed name'
      };
      this.onerror();
    } else {
      if(mozApps.mockupAppIsInstalled) {
        this.result = {}; // TODO should be an App object
      } else {
        this.result = null;
      }
      this.onsuccess();
    }

  };
}


function FakeInstallAppDOMRequest() {
  FakeDOMRequest.call(this);

  this.execute = function() {

    this.readyState = 'done';

    if(this.shouldFail) {
      this.error = {
        name: 'Failed install'
      };
      this.onerror();
    } else {
      if(mozApps.mockupAppWillBeInstalled) {
        mozApps.mockupAppIsInstalled = true;
        this.result = {}; // TODO should be an App object
        this.onsuccess();
      } else {
        this.result = null;
      }

    }
  };

}


function checkInstalled(manifestPath) {
  // returns a fake request that tries to execute almost immediately
  var req = new FakeDOMRequest();

  if(mozApps.mockupCheckInstalledFails) {
    req.shouldFail = true;
  }

  setTimeout(function() {
    req.execute();
  }, 1);

  return req;
}


function install(manifestPath) {
  var req = new FakeInstallAppDOMRequest();
  
  if(mozApps.mockupInstallFails) {
    req.shouldFail = true;
  }

  setTimeout(function() {
    req.execute();
  }, 1);

  return req;

}

mozApps.checkInstalled = checkInstalled;
mozApps.install = install;

module.exports = mozApps;

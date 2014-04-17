# Mortar AppInstall [![Build Status](https://travis-ci.org/sole/mortar-appinstall.svg?branch=master)](https://travis-ci.org/sole/mortar-appinstall)

This is a library for helping with Web App installations.

It is part of, and used in the [mortar](https://github.com/mozilla/mortar/) template collection for building [Open Web Apps](https://developer.mozilla.org/en-US/Apps).

## Obtaining

There are a few ways to get this library:

If you use [Git](http://www.git-scm.com/):

````bash
git clone https://github.com/mozilla/mortar-appinstall.git
````

Or download the latest version in this [ZIP file](https://github.com/mozilla/mortar-appinstall/archive/master.zip).


## Usage

This library only works for installing or checking the status of hosted apps.

Include the library in the document from where you want to manage the installation of your app. It has to be loaded before you try to access it. E.g. if you use `AppInstall` in `main.js`, load `AppInstall` first:

````html
<script src="AppInstall.js"></script>
<script src="main.js"></script>
````

Most of the methods in `AppInstall` are asynchronous, meaning they will return immediately without blocking execution, but the actual results might take a little longer to be obtained, and will be returned via a callback. See the reference for each function for more information.

Apps cannot be installed if the page is accessed via the `file:///` protocol. That means you'll get either all failures or security errors if you try to install or check for install status from a document.

You'll need to test this out using at least a local server. The good news is this is quite easy to do in most systems!

For example, if you're running Linux or Mac you can do:

````bash
python -m SimpleHTTPServer 8000
````

then access `localhost:8000` or `your.computer.ip:8000` (for example, `192.168.0.25`) using Firefox (Desktop or Mobile), or the Browser app in a Firefox OS simulator (or device).

You'll need to use the IP address when using a physical device. Change the port accordingly, if you're running a webserver in this port already.

Then...

### `isInstallable()` - checking if the app is installable (synchronous)

This ensures that we are running in an environment where apps can actually be installed.

````javascript
var canBeInstalled = AppInstall.isInstallable();

if(canBeInstalled) {
	// perhaps show install button
}
````

### `guessManifestPath()` - build absolute path to the manifest (synchronous)

You need to provide an absolute path to the `manifest.webapp` file, meaning you can't just say `install('manifest.webapp')`. Since you might be testing in different environments (localhost, your staging server, etc) and you should never hardcode values, we're providing this method that will try to guess where the manifest lives, using the existing page as start.

````javascript
var manifestPath = AppInstall.guessManifestPath();
````

For example, if you're calling `guessManifestPath` from `http://localhost:8000/index.html`, it should return `http://localhost:8000/manifest.webapp`. But if you later decide to start the server in another port, say `1234`, it would return `http://localhost:1234/manifest.webapp`. When you finally deploy this code to your server, the return value will be `http://example.com/manifest.webapp`.

### `isInstalled(manifestPath, callback)` - checking if the app is already installed (asynchronous)

You can use `guessManifestPath` to fill in the value of `manifestPath`. The callback signature is `(error, appIsInstalled)`, meaning if there's an error it will be passed as a String, else it will be false and the actual answer to the `isInstalled` question will be the value of `appIsInstalled`. For example:

````javascript
// Generates an absolute path to manifest.webapp,
// even if running from a folder.
// Or you can pass it the path to the file too, it's up to you.
var manifestPath = AppInstall.guessManifestPath(); 

// We'll pass this callback as a parameter to AppInstall.isInstalled
// It's cleaner to define it here rather than passing it inline
function isInstalledResult(error, appIsInstalled) {
	if(error) {
		alert('There was an error checking for installation status');
	} else {
		if(appIsInstalled) {
			alert('App is installed');
		} else {
			alert('App is not installed yet');
		}
	}
}

AppInstall.isInstalled(manifestPath, isInstalledResult);
````

### install(manifestPath, callback) - initiate the app installation process (asynchronous)

As in `isInstalled`, you can use `guessManifestPath` to fill the value of `manifestPath`.

The callback signature is `(error)`. As before, when the process is completed, if there was an error it will be a String in the `error` parameter, else if everything went well, `error` will be false and your app will have been installed successfully.

````javascript
var manifestPath = AppInstall.guessManifestPath();

function installResult(error) {
	if(error) {
		alert('Error installing: ' + error);
	} else {
		alert('App was installed, yay');
		// Perhaps hide install button now!
	}
}

AppInstall.install(manifestPath, installResult);

````

### setupMockups(mockupWindow) - for testing purposes (synchronous)

Since we run tests in a `node.js` environment but that environment doesn't have a `window` object let alone a `mozApps` property in `window`, we have to somehow simulate that exists. So the purpose of `setupMockups` is to pass in a mockup object that acts as `window` would, only it's not a true `window` object, so we can configure it to have `mozApps` fail or be successful on purpose and test that the right things happen at the right moment.

You generally won't need to use this method on your day to day app installing activities. Have a look at the `tests/tests.js` file to see it in action.


## Running tests

The tests use [nodeunit](https://github.com/caolan/nodeunit). To run them you'll need to install `node.js` first, and then nodeunit globally:

````bash
npm install nodeunit -g
````

Then cd to the library directory and run

````
nodeunit tests/tests.js
````

We've set up [Travis](https://travis-ci.org/sole/mortar-appinstall) to run these tests somewhat automatically, so if all the tests pass, we get a "build passing" badge on top, right to the repository name.

## Code walkthrough

TODO

## Getting help

If you find something that doesn't quite work as you'd expect, we'd appreciate if you [filed a bug](https://github.com/mozilla/mortar-appinstall/issues)!

We need your help in order to help you. Therefore:

1. Tell us which version of the template are you using. Where did you get the code from?
* Specify the environment where the bug occurs i.e. which browser were you using, or which version of the Simulator or Firefox OS device. An example would be `Firefox 30.0a1 Nightly 20140210`. You can generally get this data from the *About* menu in your browser. Also maybe tell us if you have experimental features enabled in your browser (for example, support for web components).
* Describe the problem in detail. What were you doing? What happened? What did you expect to happen?
* Probably also provide a test case so we can see what is happening and try to reproduce the error.

Ultimately it all boils down to the fact that if we can't reproduce it, we can't help you or fix it either.

## Contributing

Contributions are always welcome! If you want to collaborate, whether that is with a new feature or fixing a bug, we recommend you...

1. Have a look at the [issue tracker](https://github.com/mozilla/mortar-appinstall/issues) first--to make sure there isn't anyone working on that already.
* If it's a new issue/feature, or no one is working on it already, fork the project in GitHub (you'll need an account if you don't have one yet).
* Create the bug to let us know you want to work on this. That way we are aware of and can keep an eye on it, or maybe tell you that it is not a bug but an intended feature, and save you the hassle of working on something that is not needed.
* Clone your fork to your computer (i.e. get the code onto your computer)
* Make a new branch, and switch to that new branch
* Do the changes you deem necessary
* Push the branch to GitHub
* Send a pull request

To make your changes as easy to merge back onto the project as possible, you should only work on one feature per branch. That makes code review simpler and faster!


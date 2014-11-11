# Ehealth Container Application

This is an atom-shell app that acts as a thin wrapper for [the Atom branch of the SL call center app](https://github.com/eHealthAfrica/sl-ebola-call-admin/tree/atom) (details on that below), it basically just opens a URL. But if that URL points to an app that uses AppCache and local data storage (PouchDB for example), you now have an _offline-capable, auto-updating cross-platform application_. Yay!

So, `app/main.js`, line 30 onwards, defines which URL gets wrapped.

## NOTE: You may not have to build the wrapper to change the URL

- On __OS X__, you can just browse the contents of the built package, find `Contents/Resources/App/main.js` and modify the target.
- On __Linux__, it's even easier, just open `resources/App/main.js` directly.
- On __Windows__, you're out of luck, sorry.

## Building the Wrapper

    $ npm install
    $ grunt


This will write fresh OS X, Windows32 and Linux32 builds into the `build` directory.

## Making the builds look good

The folders, packages, executables etc. will still be called `Atom` and will use the Atom logo. We don't want that. Here's how to mod them (sorry, this is terrible/impossible to automate):

### OS X

1. Right-click `build/darwin/atom-shell/atom.app` and show package contents.
2. Replace the file `/Resources/atom.icns with this one: `app/ehealth_logo.icns`.
3. Inside `info.plist` find `<key>CFBundleName</key>` and change the following line to `<string>eHealth - Call Center</string>`.
4. In the same file, find `<key>CFBundleIconFile</key>` and change the following line to `<string>ehealth_logo.icns</string>`.
5. Rename the package from step 1 to whatever app it is you're wrapping.

On OS X, you also have the option of changing the wrapper target in the built app, so you don't have to build and modify the wrapper for each target. To do this, open the package, and inside that the file `Contents/Resources/App/main.js`. You'll find the build targets from line 30 onwards.

### Windows

This step is only possible on Windows, unless you want to wrap Reshacker in Wine.

1. Rename `build/win32/atom-shell/atom.exe` to whatever app it is you're wrapping.
2. Download [Resource Hacker](http://www.angusj.com/resourcehacker/reshack_setup.exe).
3. Run Resource Hacker and drag the `.exe` onto it.
4. In Resource Hacker, click `action -> replace icon`, and select the `ehealth_logo.ico` file from the `app` folder.

### Linux

I have no idea.

## Making Apps Wrappable

Apart from implementing AppCache, the call center needed a few modifications so it would run inside Atom Shell:

### 1. Use native file saving dialog

The way `ng-csv` saves files fails silently in Atom Shell, letting us use `ng-click` to call a fallback function that checks whether we're in Atom Shell and then uses the native file API to save the CSV. See [the source](https://github.com/eHealthAfrica/sl-ebola-call-admin/blob/atom/app/scripts/controllers/calls.js#L313) for details.

### 2. Prevent print feature from opening a new window

I haven't found a way to make Atom Shell open a new Window with the same auth credentials, so clicking on `print` would always open a new login window. My solution was to open the print view in the same window, and add an explicit `Print this window` button on that that would call `window.print()`, because `CMD-P`/printing via menu doesn't work in Atom Shell at the moment. This is super simple, see [the view](https://github.com/eHealthAfrica/sl-ebola-call-admin/blob/atom/app%2Fviews%2Fcalls-print.html#L17) and [the controller](https://github.com/eHealthAfrica/sl-ebola-call-admin/blob/atom/app%2Fscripts%2Fcontrollers%2Fcalls-print.js#L56);

### 3. Make moment.js work

Moment.js is problematic because it works in both the browser and the node environment, so it will check where it is and then expose itself accordingly. Sadly, Atom Shell is a node environment, so Moment.js will expose itself as a module, and not as a browser global ([see here for an explanation](https://github.com/rogerwang/node-webkit/issues/2075)). So I [forked moment.js](https://github.com/espy/moment/blob/develop/moment.js#L2846), removed that check so it is forced to expose a global, and everything's peachy.

Enjoy!

<3

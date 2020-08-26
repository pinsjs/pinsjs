/*
 * Provides default callbacks for web browsers
 */

var pinsStorage = {}

var pinsEnsureFileSystem = function() {
  if (pinsStorage["pinFiles"] === undefined) pinsStorage["pinFiles"] = {};
  return pinsStorage["pinFiles"];
}

pins.callbacks.set("dirCreate", function(path) {
  var storage = pinsEnsureFileSystem();
  if (!/\/$/gi.test(path)) path = path + "/";
  storage[path] = "<dir>";
});

pins.callbacks.set("dirExists", function(path) {
  var storage = pinsEnsureFileSystem();
  return storage[path] === "<dir>";
});

pins.callbacks.set("dirList", function(path) {
  var storage = pinsEnsureFileSystem();
  var dirs = Object.keys(storage)
    .filter(function(e) { return (new RegExp("^" + path)).test(e); })
    .filter(function(e) { return !(new RegExp("/$")).test(e); });
  return dirs;
});

pins.callbacks.set("dirRemove", function(path) {
  var storage = pinsEnsureFileSystem();
  delete storage[path];
});

pins.callbacks.set("dirZip", function(path, zip, commonPath) {
  // NYI use quiet option
});

pins.callbacks.set("tempfile", function() {
  return "/temp/" + (Math.floor(Math.random() * 1000000000)).toString();
});

pins.callbacks.set("readLines", function(path) {
  var storage = pinsEnsureFileSystem();
  return atob(storage[path]).split("\n");
});

pins.callbacks.set("writeLines", function(path, content) {
  var storage = pinsEnsureFileSystem();
  return storage[path] = btoa(content.join("\n"));
});

pins.callbacks.set("basename", function(path) {
  return path.replace(/.*\//gi, "");
});

pins.callbacks.set("boardRegisterCode", function() {
  return null;
});

pins.callbacks.set("uiViewerRegister", function() {
  return null;
});

pins.callbacks.set("userCacheDir", function(name) {
  return "/pins/" + name;
});

pins.callbacks.set("pinLog", function(message) {
  console.log(message);
});

pins.options = {};
pins.callbacks.set("getOption", function(option) {
  return pins.options[option];
});

pins.callbacks.set("fileWrite", function(object, path) {
  var storage = pinsEnsureFileSystem();
  storage[path] = btoa(object);
});

pins.callbacks.set("fileRead", function(path) {
  var storage = pinsEnsureFileSystem();
  return atob(storage[path]);
});

pins.callbacks.set("filePath", function(path1, path2) {
  return path1 + "/" + path2;
});

pins.callbacks.set("fileExists", function(path) {
  var storage = pinsEnsureFileSystem();
  return storage[path] !== undefined;
});

pins.callbacks.set("fileCopy", function(from, to, recursive) {
  if (!recursive) throw new Error("NYI");

  var storage = pinsEnsureFileSystem();

  if (!Array.isArray(from)) from = [from];

  Object.keys(storage)
    .filter(e => (new RegExp("^" + from.join("|^"))).test(e))
    .filter(e => !(new RegExp("/$")).test(e))
    .forEach(e => {
      var subpath = "";

      if (e.includes('_versions')) {
        subpath = e.slice(e.indexOf('_versions'));
      } else {
        subpath = e.replace(new RegExp(".*/"), "");
      }

      storage[to + "/" + subpath] = storage[e];
    });



  return true;
});

pins.callbacks.set("createLink", function(from, to) {
  return pins.callbacks.get("fileCopy")(from, to, { recursive: true });
});

pins.callbacks.set("fileSize", function(path) {
  return 0;
});

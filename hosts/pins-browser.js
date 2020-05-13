/*
 * Provides defaults callbacks for web browsers
 */

pins.callbacks.set("dirCreate", function() { localStorage[path] = []; });
pins.callbacks.set("dirExists", function() { return localStorage[path] ? true : false; });
pins.callbacks.set("dirList", function() { return null; });
pins.callbacks.set("dirRemove", function(path) { localStorage[path] = null; });

pins.callbacks.set("tempfile", function() { return "/temp/" + (Math.floor(Math.random() * 1000000000)).toString(); });
pins.callbacks.set("readLines", function() { return null; });
pins.callbacks.set("basename", function() { return null; });
pins.callbacks.set("boardRegisterCode", function() { return null; });
pins.callbacks.set("uiViewerRegister", function() { return null; });
pins.callbacks.set("userCacheDir", function(name) { return "pins/" + name; });
pins.callbacks.set("pinLog", function(message) { console.log(message); });

pins.options = {};
pins.callbacks.set("getOption", function(option) {
  return pins.options[option];
});

pins.callbacks.set("fileWrite", function(object, path) {
  localStorage[path] = object;
});
pins.callbacks.set("fileRead", function(path) {
  return localStorage[path];
});
pins.callbacks.set("filePath", function(path1, path2) {
  return path1 + "/" + path2;
});

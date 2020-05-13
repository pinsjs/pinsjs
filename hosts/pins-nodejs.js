/*
 * Provides defaults callbacks for Node.js
 */

pins.callbacks.set("dirCreate", function() { return null; });
pins.callbacks.set("dirExists", function() { return null; });
pins.callbacks.set("dirList", function() { return null; });
pins.callbacks.set("dirRemove", function() { return null; });
pins.callbacks.set("tempfile", function() { return null; });
pins.callbacks.set("readLines", function() { return null; });
pins.callbacks.set("basename", function() { return null; });
pins.callbacks.set("boardRegisterCode", function() { return null; });
pins.callbacks.set("uiViewerRegister", function() { return null; });
pins.callbacks.set("userCacheDir", function(name) { return "pins/" + name; });
pins.callbacks.set("pinLog", function(message) { console.log(message); });
pins.callbacks.set("fileWrite", function(object, path) {
  // fs.writeFileSync(file, JSON.stringify(object));
});
pins.callbacks.set("fileRead", function(path) {
  // return fs.readFileSync(file, 'utf8');
});
pins.callbacks.set("filePath", function(path1, path2) {
  // return fs.readFileSync(file, 'utf8');
});
pins.callbacks.set("fileExists", function(path) {
  return true;
});
pins.callbacks.set("fileCopy", function(from, to, recursive) {
  return true;
});

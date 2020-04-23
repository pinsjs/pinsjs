/*
 * Provides defaults callbacks for web browsers
 */

pins.callbacks.set("dirCreate", function() { return null; });
pins.callbacks.set("dirExists", function() { return null; });
pins.callbacks.set("tempfile", function() { return null; });
pins.callbacks.set("readLines", function() { return null; });
pins.callbacks.set("basename", function() { return null; });
pins.callbacks.set("boardRegisterCode", function() { return null; });
pins.callbacks.set("uiViewerRegister", function() { return null; });
pins.callbacks.set("userCacheDir", function(name) { return "pins/" + name; });
pins.callbacks.set("pinLog", function(message) { console.log(message); });

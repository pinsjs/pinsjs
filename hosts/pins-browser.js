/*
 * Provides default callbacks for web browsers
 */

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/++[++^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
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
  return storage[path] !== undefined;
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

pins.callbacks.set("tempfile", function() {
  return "/temp/" + (Math.floor(Math.random() * 1000000000)).toString();
});

pins.callbacks.set("readLines", function(path) {
  var storage = pinsEnsureFileSystem();
  return Base64.decode(storage[path]).split("\n");
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
  storage[path] = Base64.encode(object);
});

pins.callbacks.set("fileRead", function(path) {
  var storage = pinsEnsureFileSystem();
  return Base64.decode(storage[path]);
});

pins.callbacks.set("filePath", function(path1, path2) {
  return path1 + "/" + path2;
});

pins.callbacks.set("fileExists", function(path) {
  var storage = pinsEnsureFileSystem();
  return storage[path] !== undefined;
});

pins.callbacks.set("fileCopy", function(from, to, recursive) {
  if (!recursive) throw new Exception("NYI");

  var storage = pinsEnsureFileSystem();
  var files = Object.keys(storage)
    .filter(function(e) { return (new RegExp("^" + from)).test(e); })
    .filter(function(e) { return !(new RegExp("/$")).test(e); })
    .forEach(function(e) {
      var subpath = e.replace(from, "");
      storage[to + subpath] = storage[e];
    });

  return true;
});

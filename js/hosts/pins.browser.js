/*
 * Provides default callbacks for web browsers
 */

// jsSHA 3.1.2 https://cdnjs.com/libraries/jsSHA -- BSD 3 License -- https://github.com/Caligatio/jsSHA
!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(t=t||self).jsSHA=r()}(this,function(){"use strict";var i,t,r,n=function(t,r){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var n in r)r.hasOwnProperty(n)&&(t[n]=r[n])})(t,r)},d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function s(t,r,n,e){for(var o,i,u=r||[0],s=(n=n||0)>>>3,h=-1===e?3:0,a=0;a<t.length;a+=1)o=(i=a+s)>>>2,u.length<=o&&u.push(0),u[o]|=t[a]<<8*(h+e*(i%4));return{value:u,binLen:8*t.length+n}}function u(t,n,u){switch(n){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(t){case"HEX":return function(t,r,n){return function(t,r,n,e){var o,i,u;if(0!=t.length%2)throw new Error("String of HEX type must be in byte increments");for(var s=r||[0],h=(n=n||0)>>>3,a=-1===e?3:0,f=0;f<t.length;f+=2){if(o=parseInt(t.substr(f,2),16),isNaN(o))throw new Error("String of HEX type contains invalid characters");for(i=(u=(f>>>1)+h)>>>2;s.length<=i;)s.push(0);s[i]|=o<<8*(a+e*(u%4))}return{value:s,binLen:4*t.length+n}}(t,r,n,u)};case"TEXT":return function(t,d,r){return function(t,r,n,e){var o,i,u,s,h,a,f,c,p=0,l=d||[0],w=(n=n||0)>>>3;if("UTF8"===r)for(f=-1===e?3:0,u=0;u<t.length;u+=1)for(i=[],(o=t.charCodeAt(u))<128?i.push(o):o<2048?(i.push(192|o>>>6),i.push(128|63&o)):o<55296||57344<=o?i.push(224|o>>>12,128|o>>>6&63,128|63&o):(u+=1,o=65536+((1023&o)<<10|1023&t.charCodeAt(u)),i.push(240|o>>>18,128|o>>>12&63,128|o>>>6&63,128|63&o)),s=0;s<i.length;s+=1){for(h=(a=p+w)>>>2;l.length<=h;)l.push(0);l[h]|=i[s]<<8*(f+e*(a%4)),p+=1}else for(f=-1===e?2:0,c="UTF16LE"===r&&1!==e||"UTF16LE"!==r&&1===e,u=0;u<t.length;u+=1){for(o=t.charCodeAt(u),!0==c&&(o=(s=255&o)<<8|o>>>8),h=(a=p+w)>>>2;l.length<=h;)l.push(0);l[h]|=o<<8*(f+e*(a%4)),p+=2}return{value:l,binLen:8*p+n}}(t,n,r,u)};case"B64":return function(t,w,r){return function(t,r,n){var e,o,i,u,s,h,a=0,f=w||[0],c=(r=r||0)>>>3,p=-1===n?3:0,l=t.indexOf("=");if(-1===t.search(/^[a-zA-Z0-9=+/]+$/))throw new Error("Invalid character in base-64 string");if(t=t.replace(/=/g,""),-1!==l&&l<t.length)throw new Error("Invalid '=' found in base-64 string");for(e=0;e<t.length;e+=4){for(u=t.substr(e,4),o=i=0;o<u.length;o+=1)i|=d.indexOf(u.charAt(o))<<18-6*o;for(o=0;o<u.length-1;o+=1){for(s=(h=a+c)>>>2;f.length<=s;)f.push(0);f[s]|=(i>>>16-8*o&255)<<8*(p+n*(h%4)),a+=1}}return{value:f,binLen:8*a+r}}(t,r,u)};case"BYTES":return function(t,f,r){return function(t,r,n){for(var e,o,i,u=f||[0],s=(r=r||0)>>>3,h=-1===n?3:0,a=0;a<t.length;a+=1)e=t.charCodeAt(a),o=(i=a+s)>>>2,u.length<=o&&u.push(0),u[o]|=e<<8*(h+n*(i%4));return{value:u,binLen:8*t.length+r}}(t,r,u)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch(t){throw new Error("ARRAYBUFFER not supported by this environment")}return function(t,r,n){return e=r,o=n,i=u,s(new Uint8Array(t),e,o,i);var e,o,i};case"UINT8ARRAY":try{new Uint8Array(0)}catch(t){throw new Error("UINT8ARRAY not supported by this environment")}return function(t,r,n){return s(t,r,n,u)};default:throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}function h(t,h,r,n){switch(t){case"HEX":return function(t){return function(t,r,n){for(var e,o="",i=h/8,u=-1===r?3:0,s=0;s<i;s+=1)e=t[s>>>2]>>>8*(u+r*(s%4)),o+="0123456789abcdef".charAt(e>>>4&15)+"0123456789abcdef".charAt(15&e);return n.outputUpper?o.toUpperCase():o}(t,r,n)};case"B64":return function(t){return function(t,r,n,e){for(var o,i,u,s,h="",a=r/8,f=-1===n?3:0,c=0;c<a;c+=3)for(u=c+1<a?t[c+1>>>2]:0,s=c+2<a?t[c+2>>>2]:0,i=(t[c>>>2]>>>8*(f+n*(c%4))&255)<<16|(u>>>8*(f+n*((c+1)%4))&255)<<8|s>>>8*(f+n*((c+2)%4))&255,o=0;o<4;o+=1)h+=8*c+6*o<=r?d.charAt(i>>>6*(3-o)&63):e.b64Pad;return h}(t,h,r,n)};case"BYTES":return function(t){return function(t,r){for(var n,e="",o=h/8,i=-1===r?3:0,u=0;u<o;u+=1)n=t[u>>>2]>>>8*(i+r*(u%4))&255,e+=String.fromCharCode(n);return e}(t,r)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch(t){throw new Error("ARRAYBUFFER not supported by this environment")}return function(t){return function(t,r){for(var n=h/8,e=new ArrayBuffer(n),o=new Uint8Array(e),i=-1===r?3:0,u=0;u<n;u+=1)o[u]=t[u>>>2]>>>8*(i+r*(u%4))&255;return e}(t,r)};case"UINT8ARRAY":try{new Uint8Array(0)}catch(t){throw new Error("UINT8ARRAY not supported by this environment")}return function(t){return function(t,r){for(var n=h/8,e=-1===r?3:0,o=new Uint8Array(n),i=0;i<n;i+=1)o[i]=t[i>>>2]>>>8*(e+r*(i%4))&255;return o}(t,r)};default:throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}function a(t){var r={outputUpper:!1,b64Pad:"=",outputLen:-1},n=t||{},e="Output length must be a multiple of 8";if(r.outputUpper=n.outputUpper||!1,n.b64Pad&&(r.b64Pad=n.b64Pad),n.outputLen){if(n.outputLen%8!=0)throw new Error(e);r.outputLen=n.outputLen}else if(n.shakeLen){if(n.shakeLen%8!=0)throw new Error(e);r.outputLen=n.shakeLen}if("boolean"!=typeof r.outputUpper)throw new Error("Invalid outputUpper formatting option");if("string"!=typeof r.b64Pad)throw new Error("Invalid b64Pad formatting option");return r}function l(t,r){return t<<r|t>>>32-r}function w(t,r){var n=(65535&t)+(65535&r);return(65535&(t>>>16)+(r>>>16)+(n>>>16))<<16|65535&n}function v(t,r,n,e,o){var i=(65535&t)+(65535&r)+(65535&n)+(65535&e)+(65535&o);return(65535&(t>>>16)+(r>>>16)+(n>>>16)+(e>>>16)+(o>>>16)+(i>>>16))<<16|65535&i}function f(t){return[1732584193,4023233417,2562383102,271733878,3285377520]}function c(t,r){for(var n,e,o,i,u=[],s=r[0],h=r[1],a=r[2],f=r[3],c=r[4],p=0;p<80;p+=1)u[p]=p<16?t[p]:l(u[p-3]^u[p-8]^u[p-14]^u[p-16],1),n=p<20?v(l(s,5),h&a^~h&f,c,1518500249,u[p]):p<40?v(l(s,5),h^a^f,c,1859775393,u[p]):p<60?v(l(s,5),(e=h)&(o=a)^e&(i=f)^o&i,c,2400959708,u[p]):v(l(s,5),h^a^f,c,3395469782,u[p]),c=f,f=a,a=l(h,30),h=s,s=n;return r[0]=w(s,r[0]),r[1]=w(h,r[1]),r[2]=w(a,r[2]),r[3]=w(f,r[3]),r[4]=w(c,r[4]),r}function p(t,r,n,e){for(var o,i=15+(r+65>>>9<<4),u=r+n;t.length<=i;)t.push(0);for(t[r>>>5]|=128<<24-r%32,t[i]=4294967295&u,t[i-1]=u/4294967296|0,o=0;o<t.length;o+=16)e=c(t.slice(o,o+16),e);return e}return A.prototype.update=function(t){for(var r=0,n=this.T>>>5,e=this.s(t,this.Y,this.I),o=e.binLen,i=e.value,u=o>>>5,s=0;s<u;s+=n)r+this.T<=o&&(this.U=this.A(i.slice(s,s+n),this.U),r+=this.T);this.H+=r,this.Y=i.slice(r>>>5),this.I=o%this.T,this.C=!0},A.prototype.getHash=function(t,r){var n,e,o=this.m,i=a(r);if(this.F){if(-1===i.outputLen)throw new Error("Output length must be specified in options");o=i.outputLen}var u=h(t,o,this.u,i);if(this.L&&this.i)return u(this.i(i));for(e=this.R(this.Y.slice(),this.I,this.H,this.p(this.U),o),n=1;n<this.numRounds;n+=1)this.F&&o%32!=0&&(e[e.length-1]&=16777215>>>24-o%32),e=this.R(e,o,0,this.l(this.g),o);return u(e)},A.prototype.setHMACKey=function(t,r,n){if(!this.t)throw new Error("Variant does not support HMAC");if(this.C)throw new Error("Cannot set MAC key after calling update");var e=u(r,(n||{}).encoding||"UTF8",this.u);this.B(e(t))},A.prototype.B=function(t){var r,n=this.T>>>3,e=n/4-1;if(1!==this.numRounds)throw new Error("Cannot set numRounds with MAC");if(this.L)throw new Error("MAC key already set");for(n<t.binLen/8&&(t.value=this.R(t.value,t.binLen,0,this.l(this.g),this.m));t.value.length<=e;)t.value.push(0);for(r=0;r<=e;r+=1)this.N[r]=909522486^t.value[r],this.S[r]=1549556828^t.value[r];this.U=this.A(this.N,this.U),this.H=this.T,this.L=!0},A.prototype.getHMAC=function(t,r){var n=a(r);return h(t,this.m,this.u,n)(this.o())},A.prototype.o=function(){if(!this.L)throw new Error("Cannot call getHMAC without first setting MAC key");var t=this.R(this.Y.slice(),this.I,this.H,this.p(this.U),this.m),r=this.A(this.S,this.l(this.g));return this.R(t,this.m,this.T,r,this.m)},n(t=e,r=i=A),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o),e;function e(t,r,n){var e=this;if("SHA-1"!==t)throw new Error("Chosen SHA variant is not supported");var o=n||{};return(e=i.call(this,t,r,n)||this).t=!0,e.i=e.o,e.u=-1,e.s=u(e.h,e.v,e.u),e.A=c,e.p=function(t){return t.slice()},e.l=f,e.R=p,e.U=[1732584193,4023233417,2562383102,271733878,3285377520],e.T=512,e.m=160,e.F=!1,o.hmacKey&&e.B(function(t,r){var n="hmacKey must include a value and format";if(!t)throw new Error(n);if(void 0===t.value||!t.format)throw new Error(n);return u(t.format,t.encoding||"UTF8",r)(t.value)}(o.hmacKey,e.u)),e}function o(){this.constructor=t}function A(t,r,n){var e=n||{};if(this.h=r,this.v=e.encoding||"UTF8",this.numRounds=e.numRounds||1,isNaN(this.numRounds)||this.numRounds!==parseInt(this.numRounds,10)||this.numRounds<1)throw new Error("numRounds must a integer >= 1");this.g=t,this.Y=[],this.I=0,this.C=!1,this.H=0,this.L=!1,this.N=[],this.S=[]}});

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
  return decodeURIComponent(escape(atob(storage[path]))).split("\n");
});

pins.callbacks.set("writeLines", function(path, content) {
  var storage = pinsEnsureFileSystem();
  storage[path] = btoa(unescape(encodeURIComponent(content.join("\n"))));
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

pins.callbacks.set("uiViewerClose", function() {
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
  storage[path] = btoa(unescape(encodeURIComponent(object)));
});

pins.callbacks.set("fileRead", function(path) {
  var storage = pinsEnsureFileSystem();
  return decodeURIComponent(escape(atob(storage[path])));
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

pins.callbacks.set("md5", (str, key) => { return md5 ? md5(str, key) : '' });

pins.callbacks.set("fetch", window.fetch);

pins.callbacks.set("sha1", function(content, key) {
  const shaObj = new jsSHA("SHA-1", "TEXT");
  shaObj.setHMACKey(key, "TEXT");
  shaObj.update(content);
  const kmac = shaObj.getHash("B64", { outputLen: 256 });

  return kmac;
});

pins.callbacks.set("env", name => (new URLSearchParams(window.location.search)).get(name));
pins.callbacks.set("platform", () => '');
pins.callbacks.set("which", () => '');
pins.callbacks.set("exec", () => '');

pins.callbacks.set('getFunction', () => {});

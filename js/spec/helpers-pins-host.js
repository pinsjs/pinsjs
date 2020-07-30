/*
 * Helper to initialize tests in node and browser
 */

var pins = require('../dist/pins.node');
var pinsNode = require('../hosts/pins.node.js');

exports.pins = pinsNode.init(pins);
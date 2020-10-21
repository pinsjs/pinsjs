const yargs = require('yargs/yargs');
const esprima = require('esprima');
const esmorph = require('esmorph');
const fs = require('fs');

const options = yargs()
 .usage("Usage: -i <input> [-o <output>]")
 .option("i", { alias: "input", describe: "The input file to trace", type: "string", demandOption: false })
 .option("o", { alias: "output", describe: "The output file with trace", type: "string", demandOption: false })
 .option("f", { alias: "function", describe: "The trace function to use", type: "string", demandOption: false })
 .argv;

options.input = options.input ? options.input : 'dist/pins.python.js';
options.output = options.output ? options.output : '../python/src/pins/js/pins.js';
options.function = options.function ? options.function : 'pinDebug';

var program = fs.readFileSync(options.input, 'utf8');
var tracer = options.function ? options.function : 'console.log'

esprima.tokenize(program);
esprima.parseScript(program);

var enter = esmorph.Tracer.FunctionEntrance(function (fn) {
    var signature = ' if (' + tracer + ') ' + tracer + '(Object.assign({ ';
    signature += 'name: "' + fn.name + '", ';
    signature += 'line: ' + fn.loc.start.line + ', ';
    signature += 'level: Math.max(0, _traceLevel++)';
    signature += ' }, arguments)';
    signature += ');';
    return signature;
});

var exit = esmorph.Tracer.FunctionExit(function (fn) {
    var signature = '_traceLevel--; ';
    return signature;
});

const traced = 'var _traceLevel = 0;\n' + esmorph.modify(program, [ enter, exit ]);


if (options.output) {
  fs.writeFileSync(options.output, traced);
}
else {
  console.log(traced);
}

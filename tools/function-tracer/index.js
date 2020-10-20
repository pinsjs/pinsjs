const yargs = require("yargs");
const esprima = require('esprima');
const esmorph = require('esmorph');
const fs = require('fs');

const options = yargs
 .usage("Usage: -f <name>")
 .option("f", { alias: "file", describe: "The file to trace", type: "string", demandOption: true })
 .argv;

console.log(`Tracing ${options.file}`);

var program = fs.readFileSync(options.file, 'utf8');

esprima.tokenize(program);
esprima.parseScript(program);

var enter = esmorph.Tracer.FunctionEntrance(function (fn) {
    var signature = ' console.log(Object.assign({ ';
    signature += 'name: "' + fn.name + '", ';
    signature += 'line: ' + fn.loc.start.line + ', ';
    signature += 'level: (++_traceLevel)';
    signature += ' }, arguments)';
    signature += ');';
    return signature;
});

var exit = esmorph.Tracer.FunctionExit(function (fn) {
    var signature = '_traceLevel--; ';
    return signature;
});

const traced = 'var _traceLevel = 0;\n' + esmorph.modify(program, [ enter, exit ]);

console.log(traced);

console.log(`Tracing complete`);
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
    var signature = ' console.log({ ';
    signature += 'name: "' + fn.name + '", ';
    signature += 'lineNumber: ' + fn.loc.start.line + ', ';
    signature += 'range: [' + fn.range[0] + ',' + fn.range[1] + ']';
    signature += ' });';
    return signature;
});

var exit = esmorph.Tracer.FunctionExit(function (fn) {
    var signature = '\n  console.log({ ';
    signature += 'name: "' + fn.name + '", ';
    signature += 'lineNumber: ' + fn.loc.start.line + ', ';
    signature += 'range: [' + fn.range[0] + ',' + fn.range[1] + ']';
    signature += ' }); ';
    return signature;
});

const traced = esmorph.modify(program, [ enter, exit ]);

console.log(traced);

console.log(`Tracing complete`);
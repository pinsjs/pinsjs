const yargs = require("yargs");
const esprima = require('esprima');
const esmorph = require('esmorph');
const fs = require('fs');

const options = yargs
 .usage("Usage: -i <input> [-o <output>]")
 .option("i", { alias: "input", describe: "The input file to trace", type: "string", demandOption: true })
 .option("o", { alias: "output", describe: "The output file with trace", type: "string", demandOption: false })
 .argv;

var program = fs.readFileSync(options.input, 'utf8');

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


if (options.output) {
  fs.writeFileSync(options.output, traced);
}
else {
  console.log(traced);
}

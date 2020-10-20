const yargs = require("yargs");
const esprima = require('esprima');
const fs = require('fs');

const options = yargs
 .usage("Usage: -f <name>")
 .option("f", { alias: "file", describe: "The file to trace", type: "string", demandOption: true })
 .argv;

console.log(`Tracing ${options.file}`);

var program = fs.readFileSync(options.file, 'utf8');

esprima.tokenize(program);
esprima.parseScript(program);

console.log(`Tracing complete`);
const yargs = require("yargs");

const options = yargs
 .usage("Usage: -f <name>")
 .option("f", { alias: "file", describe: "The file to trace", type: "string", demandOption: true })
 .argv;

console.log(`Tracing ${options.file}`);

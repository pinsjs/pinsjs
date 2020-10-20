var _traceLevel = 0;
function expr(answer) { console.log(Object.assign({ name: "expr", line: 1, level: (++_traceLevel) }, arguments));
  var magic = 42;
  _traceLevel--; return answer + magic;
}

console.log('Result: ' + expr(1));
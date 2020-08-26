var pins = require('./helpers-pins-host').pins;
var test = require('./helpers-board-test');

describe("Pins host", function() {
  it("has callbacks defined", function() {
    expect(typeof(pins.callbacks)).not.toBe("undefined");
  });
});

describe("Board Local", function() {
  var textFilePath = "fixtures/files/hello.txt";
  var writeLines = pins.callbacks.get('writeLines');
  var readLines = pins.callbacks.get('readLines');
  var tempfile = pins.callbacks.get('tempfile');

  writeLines("fixtures/files/hello.txt", ["hello world"]);

  it("is registered", function() {
    pins.boardRegister("local", { cache: tempfile() });
    expect(pins.boardList().includes("local")).toBe(true);
  });

  it("can pin() file with auto-generated name in local board", function() {
    const cachedPath = pins.pin(textFilePath, { board: 'local', name: 'hello world' });

    expect(typeof(cachedPath)).toBe("string");
    expect(readLines(cachedPath)).toEqual(["hello world"]);
  });

  test.boardDefaultSuite("local", []);

  it("is registered with versions", function() {
    pins.boardRegister("local", { cache: tempfile(), versions: true });

    expect(pins.boardList().includes("local")).toBe(true);
    expect(pins.boardGet("local").versions).toBe(true);
  });

  test.boardVersionsSuite("local", [])

  pins.boardRegister("local", { cache: tempfile() });
});


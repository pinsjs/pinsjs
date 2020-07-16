var pins = require('./helpers-pins-host').pins;

describe("Pins host", function() {
  it("has callbacks defined", function() {
    expect(typeof(pins.callbacks)).not.toBe("undefined");
  });
});

describe("Board Local", function() {
  var textFilePath = "fixtures/files/hello.txt";
  var writeLines = pins.callbacks.get('writeLines')
  var tempfile = pins.callbacks.get('tempfile');

  writeLines("fixtures/files/hello.txt", ["Hello!"]);

  it("is registered", function() {
    pins.boardRegister("local", { cache: tempfile() });
    expect(pins.boardList().includes("local")).toBe(true);
  });

  it("can pin() file with auto-generated name in local board", function() {
    const cachedPath = pins.pin(textFilePath, { board: 'local', name: 'hello' });
    expect(typeof(cachedPath)).toBe("string");
  });
});

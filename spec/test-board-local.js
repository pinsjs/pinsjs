var pins = require('./helpers-pins-host').pins;

describe("Pins host", function() {
  it("has callbacks defined", function() {
    expect(typeof(pins.callbacks)).not.toBe("undefined");
  });
});

describe("Test", function() {
  it("show succeed", function() {
    var textFilePath = "fixtures/files/hello.txt";
    pins.callbacks.get('writeLines')("fixtures/files/hello.txt", ["Hello!"]);

    const cachedPath = pins.pin(textFilePath, { board: 'local', name: 'hello' });
    expect(typeof(cachedPath)).toBe("string");
  });
});
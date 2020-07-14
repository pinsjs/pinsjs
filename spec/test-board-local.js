var pins = require('./helpers-pins-host').pins;

describe("Pins host", function() {
  it("has callbacks defined", function() {
    expect(typeof(pins.callbacks)).not.toBe("undefined");
  });
});

describe("Test", function() {
  xit("show succeed", function() {
    var textFilePath = "fixtures/files/hello.txt";
    const cachedPath = pins.pin(textFilePath, { board: 'local' });
    expect(typeof(cachedPath)).toBe("string");
  });
});
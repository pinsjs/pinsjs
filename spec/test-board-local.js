describe("Test", function() {
  it("show succeed", function() {
    var textFilePath = "fixtures/files/hello.txt";
    const cachedPath = pins.pin(textFilePath, { board: 'local' });
    expect(typeof(cachedPath)).toBe("string");
  });
});
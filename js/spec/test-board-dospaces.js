var pins = require('./helpers-pins-host').pins;
var test = require('./helpers-board-test');

describe('Board DOSpaces', () => {
  const tempfile = pins.callbacks.get('tempfile');
  const env = pins.callbacks.get('env');

  const testDoSpace = env('DO_SPACE');
  const testDoKey = env('DO_KEY');
  const testDoSecret = env('DO_SECRET');
  const testDoDatacenter = env('DO_DATACENTER');

  it('board contains proper dospaces headers', () => {
    const headers = pins.dospacesHeaders({}, 'PUT', 'x', 'files/hello.txt');

    expect(headers['Host'] || '').not.toBe('');
    expect(headers['Date'] || '').not.toBe('');
    expect(headers['Content-Type'] || '').not.toBe('');
    expect(headers['Authorization'] || '').not.toBe('');
  });

  const testDospacesSuite = async (versions) => {
    if (testDoSpace) {
      if (pins.boardList().includes('dospaces')) {
        pins.boardDeregister('dospaces');
      }

      await pins.boardRegister('dospaces', {
        space: testDoSpace,
        key: testDoKey,
        secret: testDoSecret,
        datacenter: testDoDatacenter,
        cache: tempfile(),
        versions,
      });
    }

    if (pins.boardList().includes('dospaces')) {
      if (versions) test.boardDefaultSuite('dospaces', []);
      else test.boardVersionsSuite('dospaces', []);
    }
  }

  // testDospacesSuite(false);
  // testDospacesSuite(true);
});

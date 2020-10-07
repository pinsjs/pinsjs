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

  xit('is registered', async () => {
    await pins.boardRegister('dospaces', {
      space: testDoSpace,
      key: testDoKey,
      secret: testDoSecret,
      datacenter: testDoDatacenter,
      versions: false,
      cache: tempfile(),
    });

    expect(pins.boardList().includes('dospaces')).toBe(true);
  });

  // test.boardDefaultSuite('dospaces', [])

  xit('can deregister', () => {
    pins.boardDeregister('dospaces');
    expect(pins.boardList().includes('dospaces')).toBe(false);
  });

  xit('is registered with versions', async () => {
    await pins.boardRegister('dospaces', {
      space: testDoSpace,
      key: testDoKey,
      secret: testDoSecret,
      datacenter: testDoDatacenter,
      versions: true,
      cache: tempfile(),
    });

    expect(pins.boardList().includes('dospaces')).toBe(true);
    expect(pins.boardGet('dospaces').versions).toBe(true);
  });

  // test.boardVersionsSuite('dospaces', []);
});

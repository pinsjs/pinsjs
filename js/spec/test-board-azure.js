var pins = require('./helpers-pins-host').pins;
var test = require('./helpers-board-test');

describe('Board Azure', () => {
  const tempfile = pins.callbacks.get('tempfile');
  const env = pins.callbacks.get('env');

  const testAzureContainer = env('AZURE_CONTAINER');
  const testAzureAccount = env('AZURE_ACCOUNT');
  const testAzureKey = env('AZURE_KEY');

  it('board contains proper azure headers', () => {
    const headers = pins.azureHeaders({}, 'PUT', 'x', 'spec/fixtures/files/hello.txt');

    expect(headers['x-ms-date'] || '').not.toBe('');
    expect(headers['x-ms-version'] || '').not.toBe('');
    expect(headers['x-ms-blob-type'] || '').not.toBe('');
    expect(headers['Authorization'] || '').not.toBe('');
  });

  xit('is registered', async () => {
    await pins.boardRegister('azure', {
      container: testAzureContainer,
      account: testAzureAccount,
      key: testAzureKey,
      versions: false,
      cache: tempfile(),
    });

    expect(pins.boardList().includes('azure')).toBe(true);
  });

  // test.boardDefaultSuite('azure', [])

  xit('can deregister', () => {
    pins.boardDeregister('azure');
    expect(pins.boardList().includes('azure')).toBe(false);
  });

  xit('is registered with versions', async () => {
    await pins.boardRegister('azure', {
      container: testAzureContainer,
      account: testAzureAccount,
      key: testAzureKey,
      versions: true,
      cache: tempfile(),
    });

    expect(pins.boardList().includes('azure')).toBe(true);
    expect(pins.boardGet('azure').versions).toBe(true);
  });

  // test.boardVersionsSuite('azure', []);
});

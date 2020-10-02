var pins = require('./helpers-pins-host').pins;
var test = require('./helpers-board-test');

describe('Board Azure', () => {
  const tempfile = pins.callbacks.get('tempfile');
  const env = pins.callbacks.get('env');

  const testAzureContainer = env('AZURE_CONTAINER');
  const testAzureAccount = env('AZURE_ACCOUNT');
  const testAzureKey = env('AZURE_KEY');

  it('board contains proper azure headers', () => {
    const headers = pins.azureHeaders({}, 'PUT', 'x', 'files/hello.txt');

    expect(headers['x-ms-date'] || '').not.toBe('');
    expect(headers['x-ms-version'] || '').not.toBe('');
    expect(headers['x-ms-blob-type'] || '').not.toBe('');
    expect(headers['Authorization'] || '').not.toBe('');
  });

  const testAzureSuite = async (versions) => {
    if (testAzureContainer) {
      if (pins.boardList().includes('azure')) {
        pins.boardDeregister('azure');
      }

      await pins.boardRegister('azure', {
        container: testAzureContainer,
        account: testAzureAccount,
        key: testAzureKey,
        versions,
        cache: tempfile(),
      });
    }

    if (pins.boardList().includes('azure')) {
      if (versions) test.boardDefaultSuite('azure', []);
      else test.boardVersionsSuite('azure', []);
    }
  }

  // testAzureSuite(false);
  // testAzureSuite(true);
});

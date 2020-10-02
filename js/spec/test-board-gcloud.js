var pins = require('./helpers-pins-host').pins;
var test = require('./helpers-board-test');

describe('Board GCloud', () => {
  const tempfile = pins.callbacks.get('tempfile');
  const env = pins.callbacks.get('env');

  const testGCloudBucket = env('GOOGLE_BUCKET');

  it('board contains proper gcloud headers', () => {
    const headers = pins.gcloudHeaders({}, 'PUT', 'x', 'files/hello.txt');

    expect(headers['Content-Type'] || '').not.toBe('');
    expect(headers['Authorization'] || '').not.toBe('');
  });

  const testGCloudSuite = async (versions) => {
    if (testGCloudBucket) {
      if (pins.boardList().includes('gcloud')) {
        pins.boardDeregister('gcloud');
      }

      await pins.boardRegister('gcloud', {
        bucket: testGCloudBucket,
        cache: tempfile(),
        versions,
      });
    }

    if (pins.boardList().includes('gcloud')) {
      if (versions) test.boardDefaultSuite('gcloud', []);
      else test.boardVersionsSuite('gcloud', []);
    }
  }

  // testGCloudSuite(false);
  // testGCloudSuite(true);
});

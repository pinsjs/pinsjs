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

  xit('is registered', async () => {
    await pins.boardRegister('gcloud', {
      bucket: testGCloudBucket,
      versions: false,
      cache: tempfile(),
    });

    expect(pins.boardList().includes('gcloud')).toBe(true);
  });

  // test.boardDefaultSuite('gcloud', [])

  xit('can deregister', () => {
    pins.boardDeregister('gcloud');
    expect(pins.boardList().includes('gcloud')).toBe(false);
  });

  xit('is registered with versions', async () => {
    await pins.boardRegister('gcloud', {
      bucket: testGCloudBucket,
      versions: true,
      cache: tempfile(),
    });

    expect(pins.boardList().includes('gcloud')).toBe(true);
    expect(pins.boardGet('gcloud').versions).toBe(true);
  });

  // test.boardVersionsSuite('gcloud', []);
});

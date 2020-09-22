var pins = require('./helpers-pins-host').pins;
var test = require('./helpers-board-test');

describe('Board S3', () => {
  const tempfile = pins.callbacks.get('tempfile');
  const env = pins.callbacks.get('env');

  const testS3Bucket = env('AWS_BUCKET');
  const testS3Key = env('AWS_KEY');
  const testS3Secret = env('AWS_SECRET');

  it('board contains proper s3 headers', () => {
    const headers = pins.s3Headers({}, 'PUT', 'x');

    expect(headers['Host'] || '').not.toBe('');
    expect(headers['Date'] || '').not.toBe('');
    expect(headers['Content-Type'] || '').not.toBe('');
    expect(headers['Authorization'] || '').not.toBe('');
  });

  const testS3Suite = async (versions) => {
    if (testS3Bucket) {
      if (pins.boardList().includes('s3')) {
        pins.boardDeregister('s3');
      }

      await pins.boardRegister('s3', {
        bucket: testS3Bucket,
        key: testS3Key,
        secret: testS3Secret,
        versions,
        cache: tempfile(),
      });
    }

    if (pins.boardList().includes('s3')) {
      if (versions) test.boardDefaultSuite('s3', []);
      else test.boardVersionsSuite('s3', []);
    }
  }

  // testS3Suite(false);
  // testS3Suite(true);
});

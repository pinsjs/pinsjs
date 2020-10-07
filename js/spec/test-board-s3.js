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
    expect(headers['x-amz-date'] || '').not.toBe('');
    expect(headers['Content-Type'] || '').not.toBe('');
    expect(headers['Authorization'] || '').not.toBe('');
  });

  xit('is registered', async () => {
    await pins.boardRegister('s3', {
      bucket: testS3Bucket,
      key: testS3Key,
      secret: testS3Secret,
      versions: false,
      cache: tempfile(),
    });

    expect(pins.boardList().includes('s3')).toBe(true);
  });

  // test.boardDefaultSuite('s3', [])

  xit('can deregister', () => {
    pins.boardDeregister('s3');
    expect(pins.boardList().includes('s3')).toBe(false);
  });

  xit('is registered with versions', async () => {
    await pins.boardRegister('s3', {
      bucket: testS3Bucket,
      key: testS3Key,
      secret: testS3Secret,
      versions: true,
      cache: tempfile(),
    });

    expect(pins.boardList().includes('s3')).toBe(true);
    expect(pins.boardGet('s3').versions).toBe(true);
  });

  // test.boardVersionsSuite('s3', []);
});

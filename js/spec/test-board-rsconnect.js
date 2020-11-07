var pins = require('./helpers-pins-host').pins;
var test = require('./helpers-board-test');

describe('Board RStudio Connect', () => {
  const tempfile = pins.callbacks.get('tempfile');
  const env = pins.callbacks.get('env');

  const testRSConnectServer = env('RSCONNECT_SERVER');
  const testRSConnectKey = env('RSCONNECT_KEY');

  testRSConnectBoards = async (key, server) => {
    it('is registered', async () => {
      await pins.boardRegister('rsconnect', { key, server, cache: tempfile() });
      expect(pins.boardList().includes('rsconnect')).toBe(true);
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    test.boardDefaultSuite('rsconnect', [], server);

    it('can deregister', () => {
      pins.boardDeregister('rsconnect');
      expect(pins.boardList().includes('rsconnect')).toBe(false);
    });

    it('is registered with versions', async () => {
      await pins.boardRegister('rsconnect', { key, server, cache: tempfile(), versions: true });

      expect(pins.boardList().includes('rsconnect')).toBe(true);
      expect(pins.boardGet('rsconnect').versions).toBe(true);
    });

    // test.boardVersionsSuite('rsconnect', [], server);
  }

  if (testRSConnectServer) {
    rscServers = testRSConnectServer.split(',');
    rscApis = testRSConnectKey.split(',');

    if (rscServers.length !== rscApis.length) {
      throw new Error('Incorrect length for TEST_RSCONNECT_SERVER and RSCONNECT_API.');
    }

    rscServers.forEach((rscs, index) => {
      const server = rscs.replace('/$', '');
      const rsca = rscApis[index];

      testRSConnectBoards(rsca, server);

      // also test with trailing slash
      testRSConnectBoards(rsca, `${server}/`);
    });
  }
});

/*
 * Suite of test shared across all boarads
 */

var pins = require('./helpers-pins-host').pins;

var randomFileIndex = function() { return Math.round(Math.random() * 1000); }

var boardDefaultSuite = function(
  board,
  exclude,
  destination
) {
  var textFilePath = "fixtures/" + board + "/files/hello.txt";
  var writeLines = pins.callbacks.get('writeLines')

  var pinName = 'afile' + randomFileIndex();
  var datasetName = 'adataset' + randomFileIndex();

  describe(destination, function() {
      xit('can pin() file', function() {
        var cachedPath = pin(textFilePath, pinName, { board });

        expect(typeof cachedPath === 'string').toBe(true);
        expect(host.readLines(cachedPath)).toBe('hello world');
      });

      // TODO: Is there a better way to handle DataFrames?
      xit('can pin() data frame', function() {
        var iris = host.get('iris', { envir: 'datasets' });
        var dataset = pin(iris, datasetName, { board });

        expect(dataset).toBeInstanceOf(host.DataFrame);
      });

      xit('can pin_get() a pin', function() {
        var cachedPath = pinGet(pinName, { board });

        expect(typeof cachedPath === 'string').toBe(true);
        expect(host.readLines(cachedPath)).toBe('hello world');
      });

      xit('can pin_find() a pin in any board', function() {
        var results = pinFind({ text: pinName });
        var names = results.map(function(x) { return x.name; });

        expect(names).toContain(pinName);
      });

      xit('can pin_find() a pin', function() {
        var results = pinFind({ text: pinName, board });
        var names = results.map(({ name }) => name);

        expect(names).toContain(pinName);
      });

      xit('can pin_info()', function() {
        var { name } = pinInfo(pinName, { board });

        expect(name).toMatch(pinName);
      });

      if (!exclude.includes('remove')) {
        xit('can pin_remove() file', () => {
          var result = pinRemove(pinName, { board });

          expect(result).toBeNull();

          var results = pinFind({ name: pinName, board });

          expect(results.length).toBe(0);
        });

        xit('can pin_remove() dataset', function() {
          var result = pinRemove(datasetName, { board });

          expect(result).toBeNull();

          var results = pinFind({ name: datasetName, board });

          expect(results.length).toBe(0);
        });
      }

      if (!exclude.includes('medium files')) {
        // NOTE: This can be dependent on the order of execution...
        xit('works with medium files', function() {
          var flightsFilePath = host.tempfile('.csv');
          var flightsName = `flights${randomFileIndex()}`;
          // TODO: Write DF to flightsFilePath.
          // const flights = pinGet('nycflights13/flights');

          // TODO: Is there a better way to handle DataFrames?
          var pinResult = pin(flightsFilePath, { name: flightsName, board });

          expect(pinResult).not.toBeNull();

          var pinRemoveResult = pinRemove(flightsName, { board });

          expect(pinRemoveResult).toBeNull();

          var pinFindResults = pinFind({ name: flightsName, board });

          expect(pinFindResults.length).toBe(0);
        });
      }
  });
};

var boardVersionsSuite = function(
  board,
  destination
) {
  var pinName = 'aversion' + randomFileIndex();

  describe(destination, function() {
    test.skip('can pin() and retrieve specific version', function() {
      // Not implemented.
    });

    test.skip('can pin_remove() a pin with versions', function() {
      // Not implemented.
    });
  });
};

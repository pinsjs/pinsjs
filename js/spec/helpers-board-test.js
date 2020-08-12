/*
 * Suite of test shared across all boards
 */

var pins = require('./helpers-pins-host').pins;

var iris = [{"Sepal.Length":5.1,"Sepal.Width":3.5,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.9,"Sepal.Width":3,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.7,"Sepal.Width":3.2,"Petal.Length":1.3,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.6,"Sepal.Width":3.1,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.6,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.4,"Sepal.Width":3.9,"Petal.Length":1.7,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":4.6,"Sepal.Width":3.4,"Petal.Length":1.4,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.4,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.4,"Sepal.Width":2.9,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.9,"Sepal.Width":3.1,"Petal.Length":1.5,"Petal.Width":0.1,"Species":"setosa"},{"Sepal.Length":5.4,"Sepal.Width":3.7,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.8,"Sepal.Width":3.4,"Petal.Length":1.6,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.8,"Sepal.Width":3,"Petal.Length":1.4,"Petal.Width":0.1,"Species":"setosa"},{"Sepal.Length":4.3,"Sepal.Width":3,"Petal.Length":1.1,"Petal.Width":0.1,"Species":"setosa"},{"Sepal.Length":5.8,"Sepal.Width":4,"Petal.Length":1.2,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.7,"Sepal.Width":4.4,"Petal.Length":1.5,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":5.4,"Sepal.Width":3.9,"Petal.Length":1.3,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.5,"Petal.Length":1.4,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":5.7,"Sepal.Width":3.8,"Petal.Length":1.7,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.8,"Petal.Length":1.5,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":5.4,"Sepal.Width":3.4,"Petal.Length":1.7,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.7,"Petal.Length":1.5,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":4.6,"Sepal.Width":3.6,"Petal.Length":1,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.3,"Petal.Length":1.7,"Petal.Width":0.5,"Species":"setosa"},{"Sepal.Length":4.8,"Sepal.Width":3.4,"Petal.Length":1.9,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3,"Petal.Length":1.6,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.4,"Petal.Length":1.6,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":5.2,"Sepal.Width":3.5,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.2,"Sepal.Width":3.4,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.7,"Sepal.Width":3.2,"Petal.Length":1.6,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.8,"Sepal.Width":3.1,"Petal.Length":1.6,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.4,"Sepal.Width":3.4,"Petal.Length":1.5,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":5.2,"Sepal.Width":4.1,"Petal.Length":1.5,"Petal.Width":0.1,"Species":"setosa"},{"Sepal.Length":5.5,"Sepal.Width":4.2,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.9,"Sepal.Width":3.1,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.2,"Petal.Length":1.2,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.5,"Sepal.Width":3.5,"Petal.Length":1.3,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.9,"Sepal.Width":3.6,"Petal.Length":1.4,"Petal.Width":0.1,"Species":"setosa"},{"Sepal.Length":4.4,"Sepal.Width":3,"Petal.Length":1.3,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.4,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.5,"Petal.Length":1.3,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":4.5,"Sepal.Width":2.3,"Petal.Length":1.3,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":4.4,"Sepal.Width":3.2,"Petal.Length":1.3,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.5,"Petal.Length":1.6,"Petal.Width":0.6,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.8,"Petal.Length":1.9,"Petal.Width":0.4,"Species":"setosa"},{"Sepal.Length":4.8,"Sepal.Width":3,"Petal.Length":1.4,"Petal.Width":0.3,"Species":"setosa"},{"Sepal.Length":5.1,"Sepal.Width":3.8,"Petal.Length":1.6,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":4.6,"Sepal.Width":3.2,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5.3,"Sepal.Width":3.7,"Petal.Length":1.5,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":5,"Sepal.Width":3.3,"Petal.Length":1.4,"Petal.Width":0.2,"Species":"setosa"},{"Sepal.Length":7,"Sepal.Width":3.2,"Petal.Length":4.7,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":6.4,"Sepal.Width":3.2,"Petal.Length":4.5,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":6.9,"Sepal.Width":3.1,"Petal.Length":4.9,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":5.5,"Sepal.Width":2.3,"Petal.Length":4,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.5,"Sepal.Width":2.8,"Petal.Length":4.6,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":5.7,"Sepal.Width":2.8,"Petal.Length":4.5,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.3,"Sepal.Width":3.3,"Petal.Length":4.7,"Petal.Width":1.6,"Species":"versicolor"},{"Sepal.Length":4.9,"Sepal.Width":2.4,"Petal.Length":3.3,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":6.6,"Sepal.Width":2.9,"Petal.Length":4.6,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.2,"Sepal.Width":2.7,"Petal.Length":3.9,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":5,"Sepal.Width":2,"Petal.Length":3.5,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":5.9,"Sepal.Width":3,"Petal.Length":4.2,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":6,"Sepal.Width":2.2,"Petal.Length":4,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":6.1,"Sepal.Width":2.9,"Petal.Length":4.7,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":5.6,"Sepal.Width":2.9,"Petal.Length":3.6,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.7,"Sepal.Width":3.1,"Petal.Length":4.4,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":5.6,"Sepal.Width":3,"Petal.Length":4.5,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":5.8,"Sepal.Width":2.7,"Petal.Length":4.1,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":6.2,"Sepal.Width":2.2,"Petal.Length":4.5,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":5.6,"Sepal.Width":2.5,"Petal.Length":3.9,"Petal.Width":1.1,"Species":"versicolor"},{"Sepal.Length":5.9,"Sepal.Width":3.2,"Petal.Length":4.8,"Petal.Width":1.8,"Species":"versicolor"},{"Sepal.Length":6.1,"Sepal.Width":2.8,"Petal.Length":4,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.3,"Sepal.Width":2.5,"Petal.Length":4.9,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":6.1,"Sepal.Width":2.8,"Petal.Length":4.7,"Petal.Width":1.2,"Species":"versicolor"},{"Sepal.Length":6.4,"Sepal.Width":2.9,"Petal.Length":4.3,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.6,"Sepal.Width":3,"Petal.Length":4.4,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":6.8,"Sepal.Width":2.8,"Petal.Length":4.8,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":6.7,"Sepal.Width":3,"Petal.Length":5,"Petal.Width":1.7,"Species":"versicolor"},{"Sepal.Length":6,"Sepal.Width":2.9,"Petal.Length":4.5,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":5.7,"Sepal.Width":2.6,"Petal.Length":3.5,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":5.5,"Sepal.Width":2.4,"Petal.Length":3.8,"Petal.Width":1.1,"Species":"versicolor"},{"Sepal.Length":5.5,"Sepal.Width":2.4,"Petal.Length":3.7,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":5.8,"Sepal.Width":2.7,"Petal.Length":3.9,"Petal.Width":1.2,"Species":"versicolor"},{"Sepal.Length":6,"Sepal.Width":2.7,"Petal.Length":5.1,"Petal.Width":1.6,"Species":"versicolor"},{"Sepal.Length":5.4,"Sepal.Width":3,"Petal.Length":4.5,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":6,"Sepal.Width":3.4,"Petal.Length":4.5,"Petal.Width":1.6,"Species":"versicolor"},{"Sepal.Length":6.7,"Sepal.Width":3.1,"Petal.Length":4.7,"Petal.Width":1.5,"Species":"versicolor"},{"Sepal.Length":6.3,"Sepal.Width":2.3,"Petal.Length":4.4,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.6,"Sepal.Width":3,"Petal.Length":4.1,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.5,"Sepal.Width":2.5,"Petal.Length":4,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.5,"Sepal.Width":2.6,"Petal.Length":4.4,"Petal.Width":1.2,"Species":"versicolor"},{"Sepal.Length":6.1,"Sepal.Width":3,"Petal.Length":4.6,"Petal.Width":1.4,"Species":"versicolor"},{"Sepal.Length":5.8,"Sepal.Width":2.6,"Petal.Length":4,"Petal.Width":1.2,"Species":"versicolor"},{"Sepal.Length":5,"Sepal.Width":2.3,"Petal.Length":3.3,"Petal.Width":1,"Species":"versicolor"},{"Sepal.Length":5.6,"Sepal.Width":2.7,"Petal.Length":4.2,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.7,"Sepal.Width":3,"Petal.Length":4.2,"Petal.Width":1.2,"Species":"versicolor"},{"Sepal.Length":5.7,"Sepal.Width":2.9,"Petal.Length":4.2,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.2,"Sepal.Width":2.9,"Petal.Length":4.3,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":5.1,"Sepal.Width":2.5,"Petal.Length":3,"Petal.Width":1.1,"Species":"versicolor"},{"Sepal.Length":5.7,"Sepal.Width":2.8,"Petal.Length":4.1,"Petal.Width":1.3,"Species":"versicolor"},{"Sepal.Length":6.3,"Sepal.Width":3.3,"Petal.Length":6,"Petal.Width":2.5,"Species":"virginica"},{"Sepal.Length":5.8,"Sepal.Width":2.7,"Petal.Length":5.1,"Petal.Width":1.9,"Species":"virginica"},{"Sepal.Length":7.1,"Sepal.Width":3,"Petal.Length":5.9,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":6.3,"Sepal.Width":2.9,"Petal.Length":5.6,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.5,"Sepal.Width":3,"Petal.Length":5.8,"Petal.Width":2.2,"Species":"virginica"},{"Sepal.Length":7.6,"Sepal.Width":3,"Petal.Length":6.6,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":4.9,"Sepal.Width":2.5,"Petal.Length":4.5,"Petal.Width":1.7,"Species":"virginica"},{"Sepal.Length":7.3,"Sepal.Width":2.9,"Petal.Length":6.3,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.7,"Sepal.Width":2.5,"Petal.Length":5.8,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":7.2,"Sepal.Width":3.6,"Petal.Length":6.1,"Petal.Width":2.5,"Species":"virginica"},{"Sepal.Length":6.5,"Sepal.Width":3.2,"Petal.Length":5.1,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":6.4,"Sepal.Width":2.7,"Petal.Length":5.3,"Petal.Width":1.9,"Species":"virginica"},{"Sepal.Length":6.8,"Sepal.Width":3,"Petal.Length":5.5,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":5.7,"Sepal.Width":2.5,"Petal.Length":5,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":5.8,"Sepal.Width":2.8,"Petal.Length":5.1,"Petal.Width":2.4,"Species":"virginica"},{"Sepal.Length":6.4,"Sepal.Width":3.2,"Petal.Length":5.3,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":6.5,"Sepal.Width":3,"Petal.Length":5.5,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":7.7,"Sepal.Width":3.8,"Petal.Length":6.7,"Petal.Width":2.2,"Species":"virginica"},{"Sepal.Length":7.7,"Sepal.Width":2.6,"Petal.Length":6.9,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":6,"Sepal.Width":2.2,"Petal.Length":5,"Petal.Width":1.5,"Species":"virginica"},{"Sepal.Length":6.9,"Sepal.Width":3.2,"Petal.Length":5.7,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":5.6,"Sepal.Width":2.8,"Petal.Length":4.9,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":7.7,"Sepal.Width":2.8,"Petal.Length":6.7,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":6.3,"Sepal.Width":2.7,"Petal.Length":4.9,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.7,"Sepal.Width":3.3,"Petal.Length":5.7,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":7.2,"Sepal.Width":3.2,"Petal.Length":6,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.2,"Sepal.Width":2.8,"Petal.Length":4.8,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.1,"Sepal.Width":3,"Petal.Length":4.9,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.4,"Sepal.Width":2.8,"Petal.Length":5.6,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":7.2,"Sepal.Width":3,"Petal.Length":5.8,"Petal.Width":1.6,"Species":"virginica"},{"Sepal.Length":7.4,"Sepal.Width":2.8,"Petal.Length":6.1,"Petal.Width":1.9,"Species":"virginica"},{"Sepal.Length":7.9,"Sepal.Width":3.8,"Petal.Length":6.4,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":6.4,"Sepal.Width":2.8,"Petal.Length":5.6,"Petal.Width":2.2,"Species":"virginica"},{"Sepal.Length":6.3,"Sepal.Width":2.8,"Petal.Length":5.1,"Petal.Width":1.5,"Species":"virginica"},{"Sepal.Length":6.1,"Sepal.Width":2.6,"Petal.Length":5.6,"Petal.Width":1.4,"Species":"virginica"},{"Sepal.Length":7.7,"Sepal.Width":3,"Petal.Length":6.1,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":6.3,"Sepal.Width":3.4,"Petal.Length":5.6,"Petal.Width":2.4,"Species":"virginica"},{"Sepal.Length":6.4,"Sepal.Width":3.1,"Petal.Length":5.5,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6,"Sepal.Width":3,"Petal.Length":4.8,"Petal.Width":1.8,"Species":"virginica"},{"Sepal.Length":6.9,"Sepal.Width":3.1,"Petal.Length":5.4,"Petal.Width":2.1,"Species":"virginica"},{"Sepal.Length":6.7,"Sepal.Width":3.1,"Petal.Length":5.6,"Petal.Width":2.4,"Species":"virginica"},{"Sepal.Length":6.9,"Sepal.Width":3.1,"Petal.Length":5.1,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":5.8,"Sepal.Width":2.7,"Petal.Length":5.1,"Petal.Width":1.9,"Species":"virginica"},{"Sepal.Length":6.8,"Sepal.Width":3.2,"Petal.Length":5.9,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":6.7,"Sepal.Width":3.3,"Petal.Length":5.7,"Petal.Width":2.5,"Species":"virginica"},{"Sepal.Length":6.7,"Sepal.Width":3,"Petal.Length":5.2,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":6.3,"Sepal.Width":2.5,"Petal.Length":5,"Petal.Width":1.9,"Species":"virginica"},{"Sepal.Length":6.5,"Sepal.Width":3,"Petal.Length":5.2,"Petal.Width":2,"Species":"virginica"},{"Sepal.Length":6.2,"Sepal.Width":3.4,"Petal.Length":5.4,"Petal.Width":2.3,"Species":"virginica"},{"Sepal.Length":5.9,"Sepal.Width":3,"Petal.Length":5.1,"Petal.Width":1.8,"Species":"virginica"}];

var randomFileIndex = function() { return Math.round(Math.random() * 1000); }

var boardDefaultSuite = function(
  board,
  exclude
) {
  var textFilePath = "fixtures/" + board + "/files/hello.txt";
  var writeLines = pins.callbacks.get('writeLines');
  var readLines = pins.callbacks.get('readLines');

  writeLines(textFilePath, ["hello world"]);

  var pinName = 'afile' + randomFileIndex();
  var datasetName = 'adataset' + randomFileIndex();

  it('can pin() file', function() {
    var cachedPath = pins.pin(textFilePath, { name: pinName, board });

    expect(typeof cachedPath === 'string').toBe(true);
    expect(readLines(cachedPath)).toEqual(['hello world']);
  });

  it('can pin() data frame', function() {
    var dataset = pins.pin(iris, { name: datasetName, board });

    expect(dataset).toEqual(iris);
  });

  it('can pin_get() a pin', function() {
    var cachedPath = pins.pinGet(pinName, { board });

    expect(typeof cachedPath[0] === 'string').toBe(true);
    expect(readLines(cachedPath)).toEqual(['hello world']);
  });

  xit('can pin_find() a pin in any board', function() {
    var results = pins.pinFind(null);
    var names = results.map(({ name }) => name);

    expect(names).toContain(pinName);
  });

  it('can pin_find() a pin', function() {
    var results = pins.pinFind(datasetName, { board });
    var names = results.map(({ name }) => name);

    expect(names.length).toBe(1);
    expect(names).toContain(datasetName);
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
};

var boardVersionsSuite = function(
  board
) {
  var pinName = 'aversion' + randomFileIndex();

  xit('can pin() and retrieve specific version', function() {
    // Not implemented.
  });

  xit('can pin_remove() a pin with versions', function() {
    // Not implemented.
  });
};

if (typeof(exports) !== "undefined") {
  exports.boardDefaultSuite = boardDefaultSuite;
  exports.boardVersionsSuite = boardVersionsSuite;
}

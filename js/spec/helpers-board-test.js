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
  var tempfile = pins.callbacks.get('tempfile');
  var writeLines = pins.callbacks.get('writeLines');
  var readLines = pins.callbacks.get('readLines');

  writeLines(textFilePath, ["hello world"]);

  var pinName = 'afile' + randomFileIndex();
  var datasetName = 'adataset' + randomFileIndex();

  it('can pin() file', async () => {
    var cachedPath = await pins.pin(textFilePath, { name: pinName, board });

    expect(typeof cachedPath === 'string').toBe(true);
    expect(readLines(cachedPath)).toEqual(['hello world']);
  });

  it('can pin() data frame', async () => {
    var dataset = await pins.pin(iris, { name: datasetName, board });

    expect(dataset).toEqual(iris);
  });

  it('can pin_get() a pin', async () => {
    var cachedPath = await pins.pinGet(pinName, { board });

    expect(typeof cachedPath[0] === 'string').toBe(true);
    expect(readLines(cachedPath)).toEqual(['hello world']);
  });

  xit('can pin_find() a pin in any board', () => {
    var results = pins.pinFind(null, {});
    var names = results.map(({ name }) => name);

    expect(names).toContain(pinName);
  });

  it('can pin_find() a pin', async () => {
    var results = await pins.pinFind(datasetName, { board });
    var names = results.map(({ name }) => name);

    expect(names.length).toBe(1);
    expect(names).toContain(datasetName);
  });

  it('can pin_info()', async () => {
    var info = await pins.pinInfo(pinName, { board });

    expect(info.name).toMatch(pinName);
    expect(info.board).toMatch(board);
  });

  it('can pin() with custom metadata', async () => {
    var name = 'iris-metadata';
    var source = 'The R programming language';
    var dataset = await pins.pin(iris, {
      name, board,
      metadata: {
        source,
        columns: [
          { name: 'Species', description: 'Really like this column' },
          { name: 'Sepal.Length', description: 'Sepal Length' },
          { name: 'Sepal.Width', description: 'Sepal Width' },
          { name: 'Petal.Length', description: 'Petal Length' },
          { name: 'Petal.Width', description: 'Petal Width' },
        ],
      },
    });

    var info = await pins.pinInfo(name, { board, metadata: true });

    expect(info.name).toMatch(name);
    expect(info.source).toMatch(source);
    expect(info.columns.length).toBe(5);
  })

  if (!exclude.includes('remove')) {
    it('can pin_remove() file', async () => {
      var result = await pins.pinRemove(pinName, board);

      expect(result).toBeNull();

      var results = await pins.pinFind(pinName, { board });

      expect(results.length).toBe(0);
    });

    it('can pin_remove() dataset', async () => {
      var result = await pins.pinRemove(datasetName, board);

      expect(result).toBeNull();

      var results = await pins.pinFind(datasetName, { board });

      expect(results.length).toBe(0);
    });
  }

  // TODO: get big file from not local board
  if (!exclude.includes('medium files')) {
    // NOTE: This can be dependent on the order of execution...
    it('works with medium files', async () => {
      var flightsFilePath = tempfile('.csv');
      var flightsName = `flights${randomFileIndex()}`;

      // const flights = pins.pinGet('nycflights13/flights');
      writeLines(flightsFilePath, iris);

      // TODO: Is there a better way to handle DataFrames?
      var pinResult = await pins.pin(flightsFilePath, { name: flightsName, board });

      expect(pinResult).not.toBeNull();

      var pinRemoveResult = await pins.pinRemove(flightsName, board);

      expect(pinRemoveResult).toBeNull();

      var pinFindResults = await pins.pinFind(flightsName, { board });

      expect(pinFindResults.length).toBe(0);
    });
  }
};

var boardVersionsSuite = function(
  board,
  exclude
) {
  var pinName = 'aversion' + randomFileIndex();

  it('can pin() and retrieve specific version', async () => {
    var va = [1, 2, 3];
    var vb = [11, 12, 13];

    await pins.pin(va, { name: pinName, board });
    await pins.pin(vb, { name: pinName, board });

    var versions = pins.pinVersions(pinName, { board });

    expect(versions.version.length).toBe(2);

    var pin1 = await pins.pinGet(pinName, { board, version: versions.version[0] });
    var pin2 = await pins.pinGet(pinName, { board, version: versions.version[1] });

    expect(pin1).toEqual(vb);
    expect(pin2).toEqual(va);
  });

  if (!exclude.includes('remove')) {
    it('can pin_remove() a pin with versions', async () => {
      var result = await pins.pinRemove(pinName, board);

      expect(result).toBeNull();

      var results = await pins.pinFind(pinName, { board });

      expect(results.length).toBe(0);
    });
  }
};

if (typeof(exports) !== "undefined") {
  exports.boardDefaultSuite = boardDefaultSuite;
  exports.boardVersionsSuite = boardVersionsSuite;
}

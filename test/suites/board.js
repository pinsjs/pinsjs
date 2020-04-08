import path from 'path';
import system from 'pinsjs/system';
import { pin, pinGet, pinFind, pinInfo, pinRemove } from 'pinsjs/pin';

const randomFileIndex = () => Math.round(Math.random() * 1000);

// eslint-disable-next-line jest/no-export
export const boardDefaultSuite = (
  board,
  { exclude = [], destination = `${board} board` } = {}
) => {
  const textFilePath = path.resolve('..', 'fixtures', 'files', 'hello.txt');
  const pinName = `afile${randomFileIndex()}`;
  const datasetName = `adataset${randomFileIndex()}`;

  describe(destination, () => {
    describe('default', () => {
      test('can pin() file', () => {
        const cachedPath = pin(textFilePath, pinName, { board });

        expect(typeof cachedPath === 'string').toBe(true);
        expect(system.readLines(cachedPath)).toBe('hello world');
      });

      // TODO: Is there a better way to handle DataFrames?
      test('can pin() data frame', () => {
        const iris = system.get('iris', { envir: 'datasets' });
        const dataset = pin(iris, datasetName, { board });

        expect(dataset).toBeInstanceOf(system.DataFrame);
      });

      test('can pin_get() a pin', () => {
        const cachedPath = pinGet(pinName, { board });

        expect(typeof cachedPath === 'string').toBe(true);
        expect(system.readLines(cachedPath)).toBe('hello world');
      });

      test('can pin_find() a pin in any board', () => {
        const results = pinFind({ text: pinName });
        const names = results.map(({ name }) => name);

        expect(names).toContain(pinName);
      });

      test('can pin_find() a pin', () => {
        const results = pinFind({ text: pinName, board });
        const names = results.map(({ name }) => name);

        expect(names).toContain(pinName);
      });

      test('can pin_info()', () => {
        const { name } = pinInfo(pinName, { board });

        expect(name).toMatch(pinName);
      });

      if (!exclude.includes('remove')) {
        describe('can pin_remove()', () => {
          test('file', () => {
            const result = pinRemove(pinName, { board });

            expect(result).toBeNull();

            const results = pinFind({ name: pinName, board });

            expect(results.length).toBe(0);
          });

          test('dataset', () => {
            const result = pinRemove(datasetName, { board });

            expect(result).toBeNull();

            const results = pinFind({ name: datasetName, board });

            expect(results.length).toBe(0);
          });
        });
      }

      if (!exclude.includes('medium files')) {
        // NOTE: This can be dependent on the order of execution...
        test('works with medium files', () => {
          const flightsFilePath = system.tempfile('.csv');
          const flightsName = `flights${randomFileIndex()}`;
          // TODO: Write DF to flightsFilePath.
          // const flights = pinGet('nycflights13/flights');

          // TODO: Is there a better way to handle DataFrames?
          const pinResult = pin(flightsFilePath, { name: flightsName, board });

          expect(pinResult).not.toBeNull();

          const pinRemoveResult = pinRemove(flightsName, { board });

          expect(pinRemoveResult).toBeNull();

          const pinFindResults = pinFind({ name: flightsName, board });

          expect(pinFindResults.length).toBe(0);
        });
      }
    });
  });
};

// eslint-disable-next-line jest/no-export
export const boardVersionsSuite = (
  board,
  { destination = `${board} board` } = {}
) => {
  const pinName = `aversion${randomFileIndex()}`;

  describe(destination, () => {
    describe('versions', () => {
      test.skip('can pin() and retrieve specific version', () => {
        // Not implemented.
      });

      test.skip('can pin_remove() a pin with versions', () => {
        // Not implemented.
      });
    });
  });
};

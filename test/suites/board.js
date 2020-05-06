import path from 'path';
import host from 'pinsjs/host';
import { pin, pinGet, pinFind, pinInfo, pinRemove } from 'pinsjs/pin';

const randomFileIndex = () => Math.round(Math.random() * 1000);

// eslint-disable-next-line jest/no-export
export const boardDefaultSuite = (
  board,
  { exclude, destination } = { exclude: [], destination: `${board} board` }
) => {
  const textFilePath = path.resolve('..', 'fixtures', 'files', 'hello.txt');
  const pinName = `afile${randomFileIndex()}`;
  const datasetName = `adataset${randomFileIndex()}`;

  describe(destination, () => {
    describe('default', () => {
      test.skip('can pin() file', () => {
        const cachedPath = pin(textFilePath, pinName, { board });

        expect(typeof cachedPath === 'string').toBe(true);
        expect(host.readLines(cachedPath)).toBe('hello world');
      });

      // TODO: Is there a better way to handle DataFrames?
      test.skip('can pin() data frame', () => {
        const iris = host.get('iris', { envir: 'datasets' });
        const dataset = pin(iris, datasetName, { board });

        expect(dataset).toBeInstanceOf(host.DataFrame);
      });

      test.skip('can pin_get() a pin', () => {
        const cachedPath = pinGet(pinName, { board });

        expect(typeof cachedPath === 'string').toBe(true);
        expect(host.readLines(cachedPath)).toBe('hello world');
      });

      test.skip('can pin_find() a pin in any board', () => {
        const results = pinFind({ text: pinName });
        const names = results.map(({ name }) => name);

        expect(names).toContain(pinName);
      });

      test.skip('can pin_find() a pin', () => {
        const results = pinFind({ text: pinName, board });
        const names = results.map(({ name }) => name);

        expect(names).toContain(pinName);
      });

      test.skip('can pin_info()', () => {
        const { name } = pinInfo(pinName, { board });

        expect(name).toMatch(pinName);
      });

      if (!exclude.includes('remove')) {
        describe('can pin_remove()', () => {
          test.skip('file', () => {
            const result = pinRemove(pinName, { board });

            expect(result).toBeNull();

            const results = pinFind({ name: pinName, board });

            expect(results.length).toBe(0);
          });

          test.skip('dataset', () => {
            const result = pinRemove(datasetName, { board });

            expect(result).toBeNull();

            const results = pinFind({ name: datasetName, board });

            expect(results.length).toBe(0);
          });
        });
      }

      if (!exclude.includes('medium files')) {
        // NOTE: This can be dependent on the order of execution...
        test.skip('works with medium files', () => {
          const flightsFilePath = host.tempfile('.csv');
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
  { destination } = { destination: `${board} board` }
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

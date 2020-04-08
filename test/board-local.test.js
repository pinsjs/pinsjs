import path from 'path';
import { pin } from 'pinsjs/pin';
import system from 'pinsjs/system';
import { boardRegister, boardList, boardGet } from 'pinsjs/board';
import { boardVersionsEnabled } from 'pinsjs/versions';
import { boardDefaultSuite, boardVersionsSuite } from './suites/board';

const textFilePath = path.resolve('fixtures', 'files', 'hello.txt');

describe('local board', () => {
  describe('default', () => {
    test('can pin() file with auto-generated name', () => {
      const cachedPath = pin(textFilePath, { board: 'local' });

      expect(typeof cachedPath === 'string').toBe(true);
      expect(system.readLines(cachedPath)).toBe('hello world');
    });

    test('can be registered', () => {
      boardRegister('local', { cache: system.tempfile() });
      expect(boardList().includes('local')).toBe(true);
    });
  });

  describe('versions', () => {
    test('can be registered', () => {
      boardRegister('local', { cache: system.tempfile(), versions: true });
      expect(boardList().includes('local')).toBe(true);
      expect(boardVersionsEnabled(boardGet('local'))).toBe(true);
    });
  });
});

boardDefaultSuite('local');
boardVersionsSuite('local');

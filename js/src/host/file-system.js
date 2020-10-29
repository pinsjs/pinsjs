import callbacks from './callbacks';
import * as arrays from '../utils/arrays';

export function tempfile() {
  return callbacks.get('tempfile')();
}
export function basename(filePath) {
  return callbacks.get('basename')(filePath);
}
export function readLines(filePath) {
  return callbacks.get('readLines')(filePath);
}
export function writeLines(filePath, content) {
  return callbacks.get('writeLines')(filePath, content);
}

export const dir = Object.freeze({
  create(dirPath, options = { recursive: false }) {
    return callbacks.get('dirCreate')(dirPath, options);
  },
  exists(dirPath) {
    return callbacks.get('dirExists')(dirPath);
  },
  list(
    dirPath,
    { recursive, fullNames } = { recursive: false, fullNames: false }
  ) {
    return callbacks.get('dirList')(
      arrays.getOnly(dirPath),
      recursive,
      fullNames
    );
  },
  remove(dirPath, args) {
    dirPath = arrays.ensure(dirPath);
    return dirPath.map((e) => callbacks.get('dirRemove')(e, args));
  },
  zip(dirPath, zipFile, args) {
    return callbacks.get('dirZip')(dirPath, zipFile, args);
  },
});

export const tools = Object.freeze({
  filePathSansExt(filePath) {
    return filePath.replace(/\.[^/.]+$/, '');
  },
  fileExt(filePath) {
    return filePath.match(/\.[^/.]+$/, '')[0];
  },
});

export function write(object, path) {
  return callbacks.get('fileWrite')(object, path);
}

export function read(path) {
  return callbacks.get('fileRead')(path);
}

export function path(path1, path2) {
  return callbacks.get('filePath')(path1, path2);
}

export const normalizePath = (
  path,
  { winslash, mustWork } = { winslash: '\\', mustWork: false }
) => {
  return path;
};

export function absolutePath(path) {
  return path;
}

export function dirname(path) {
  return path.replace(/[^\/]+$/, '');
}

export function lockFile(path, timeout) {
  return callbacks.get('fileExists')(path);
}

export function fileUnlock(path) {
  return callbacks.get('fileUnlock')(path);
}

export function fileExists(path) {
  return callbacks.get('fileExists')(path);
}

export function copy(from, to, { recursive } = { recursive: true }) {
  return callbacks.get('fileCopy')(from, to, recursive);
}

export function createLink(from, to) {
  return callbacks.get('createLink')(path);
}

export function fileSize(path) {
  return callbacks.get('fileSize')(path);
}

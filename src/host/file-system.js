import callbacks from './callbacks';
import * as arrays from '../utils/arrays';

export const tempfile = () => callbacks.get('tempfile')();
export const basename = (filePath) => callbacks.get('basename')(filePath);
export const readLines = (filePath) => callbacks.get('readLines')(filePath);
export const writeLines = (filePath, content) =>
  callbacks.get('writeLines')(filePath, content);

export const dir = Object.freeze({
  create(dirPath, { recursive } = { recursive: false }) {
    return callbacks.get('dirCreate')(dirPath);
  },
  exists(dirPath) {
    return callbacks.get('dirExists')(dirPath);
  },
  list(dirPath, ...args) {
    return callbacks.get('dirList')(arrays.getOne(dirPath));
  },
  remove(dirPath, ...args) {
    dirPath = arrays.ensure(dirPath);
    return dirPath.map((e) => callbacks.get('dirRemove')(dirPath));
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

export const write = (object, path) => {
  return callbacks.get('fileWrite')(JSON.stringify(object), path);
};

export const read = (path) => {
  return callbacks.get('fileRead')(path);
};

export const path = (path1, path2) => {
  return callbacks.get('filePath')(path1, path2);
};

export const normalizePath = (
  path,
  { winslash, mustWork } = { winslash: '\\', mustWork: false }
) => {
  return path;
};

export const absolutePath = (path) => path;

export const lockFile = (path, timeout) => {
  return callbacks.get('fileExists')(path);
};

export const unlockFile = (path) => {
  return callbacks.get('fileExists')(path);
};

export const fileExists = (path) => {
  return callbacks.get('fileExists')(path);
};

export const copy = (from, to, { recursive } = { recursive: true }) => {
  return callbacks.get('fileCopy')(from, to, recursive);
};

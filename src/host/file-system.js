import callbacks from './callbacks';

export const tempfile = () => callbacks.get('tempfile')();
export const basename = (filePath) => callbacks.get('basename')(filePath);
export const readLines = (filePath) => callbacks.get('readLines')(filePath);

export const dir = Object.freeze({
  create(dirPath, { recursive } = { recursive: false }) {
    callbacks.get('dirCreate')(dirPath);
  },
  exists(dirPath) {
    callbacks.get('dirExists')(dirPath);
  },
  list(dirPath, ...args) {
    callbacks.get('dirList')(dirPath);
  },
  remove(dirPath, ...args) {
    callbacks.get('dirRemove')(dirPath);
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
  callbacks.get('fileWrite')(JSON.stringify(object), path);
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
  return path; // TODO
};

export const lockFile = (path, timeout) => {
  // TODO
};

export const unlockFile = (path) => {
  // TODO
};

export const fileExists = (path) => {
  // TODO
};

export const copy = (from, to, { recursive } = { recursive: true }) => {
  // TODO
};

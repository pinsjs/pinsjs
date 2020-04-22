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
});

export const tools = Object.freeze({
  filePathSansExt(filePath) {
    return filePath.replace(/\.[^/.]+$/, '');
  },
});

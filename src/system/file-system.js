import fs from 'fs';
import path from 'path';
import tempfile from 'tempfile';

export { tempfile };
export const basename = (filePath) => path.basename(filePath);
export const readLines = (filePath) => fs.readFileSync(filePath).toString();

export const dir = Object.freeze({
  create(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  },
});

export const tools = Object.freeze({
  filePathSansExt(filePath) {
    return filePath.replace(/\.[^/.]+$/, '');
  },
});

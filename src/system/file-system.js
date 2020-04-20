import fs from 'fs';
import tempfile from 'tempfile';

export const readLines = (filePath) => fs.readFileSync(filePath).toString();

export const dir = Object.freeze({
  create: (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  },
});

export { tempfile };

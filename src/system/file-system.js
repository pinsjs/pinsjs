import fs from 'fs';
import tempfile from 'tempfile';

export const readLines = (filePath) => fs.readFileSync(filePath).toString();

export default {
  tempfile,
  readLines,
};

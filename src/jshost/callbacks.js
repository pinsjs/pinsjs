import fs from 'fs';
import path from 'path';
import tempfile from 'tempfile';

const dirCreate = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

const dirExists = (dirPath) => {
  return fs.existsSync(dirPath);
};

const readLines = (filePath) => {
  return fs.readFileSync(filePath).toString();
};

const basename = (filePath) => {
  return path.basename(filePath);
};

export const registerCallbacks = (name) => {
  callbacks.set('dirCreate', dirCreate);
  callbacks.set('dirExists', dirExists);
  callbacks.set('tempfile', tempfile);
  callbacks.set('readLines', readLines);
  callbacks.set('basename', basename);
};

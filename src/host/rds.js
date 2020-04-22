import fs from 'fs';

export const saveRds = (object, { file }) => {
  fs.writeFileSync(file, JSON.stringify(object));
};

export const readRds = (file) => {
  JSON.parse(fs.readFileSync(file, 'utf8'));
};

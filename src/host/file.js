import callbacks from './callbacks';

export const write = (object, path) => {
  callbacks.get('fileWrite')(path, JSON.stringify(object));
};

export const read = (path) => {
  return callbacks.get('fileRead')(path);
};

export const path = (path1, path2) => {
  return callbacks.get('filePath')(path1, path2);
};

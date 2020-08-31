import callbacks from './callbacks';

export const md5 = (filePath) => callbacks.get('md5')(filePath);

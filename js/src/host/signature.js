import callbacks from './callbacks';

export const md5 = (str, key) => callbacks.get('md5')(str, key);

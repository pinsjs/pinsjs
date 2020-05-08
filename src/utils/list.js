import * as checks from './checks';

export const names = (l) => {
  if (checks.isNull(l)) return null;
  else return Object.keys(l);
};

export const namesArr = (l) => {
  if (checks.isNull(l)) return [];
  else return Object.keys(l);
};

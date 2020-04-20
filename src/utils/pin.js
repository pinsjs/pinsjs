import path from 'path';
import { BoardName } from './const';

export const pinDefaultName = (x, board) => {
  const name = path.basename(x);
  const error = new Error(
    "Can't auto-generate pin name from object, please specify the 'name' parameter."
  );

  if (!name) {
    throw error;
  }

  const sanitized = name
    .replace(/[^a-zA-Z0-9-]/gi, '-')
    .replace(/^-*|-*$/gi, '')
    .replace(/-+/gi, '-');

  if (!sanitized) {
    throw error;
  }

  if (board === BoardName.kaggle && sanitized.length < 5) {
    return `${sanitized}-pin`;
  }

  return sanitized;
};

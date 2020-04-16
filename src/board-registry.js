const BOARDS_REGISTERED = {};

export const list = () => Object.keys(BOARDS_REGISTERED);

export const get = (name) => BOARDS_REGISTERED[name];

export const set = (name, board) => {
  BOARDS_REGISTERED[name] = board;
};

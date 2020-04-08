const BOARDS_REGISTERED = {};

export const boardRegistryList = () => Object.keys(BOARDS_REGISTERED);

export const boardRegistryGet = (name) => BOARDS_REGISTERED[name];

export const boardRegistrySet = (name, board) => {
  BOARDS_REGISTERED[name] = board;
};

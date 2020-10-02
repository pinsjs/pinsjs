export const guessType = (file) => {
  const extension = file.split('.').pop();

  if (extension === 'txt') {
    return 'text/plain';
  }

  // TODO: we will need more types
  return '';
};

export function guessType(file) {
  const extension = file.split('.').pop();

  if (extension === 'txt') {
    return 'text/plain';
  }

  // TODO: add more types
  return '';
}

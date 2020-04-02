module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],

  env: {
    es6: true,
    jest: true,
  },

  rules: {
    'prettier/prettier': 'error',

    // Disable rules during code migration..
    'camelcase': 'off',
  },
};

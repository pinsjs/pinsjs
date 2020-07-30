module.exports = {
  extends: ['airbnb-base', 'prettier', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],

  env: {
    es6: true,
    jest: true,
  },

  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['pinsjs', './src'],
        ],
        extensions: ['.js'],
      },
    },
  },

  rules: {
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',

    // Disable rules during code migration..
    'camelcase': 'off',
  },
};

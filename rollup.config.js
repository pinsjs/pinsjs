import buble from '@rollup/plugin-buble';

export default {
  input: 'src/main.js',
  output: {
    name: 'pins',
    file: 'dist/pins.js',
    format: 'iife',
  },
  plugins: [buble()],
};

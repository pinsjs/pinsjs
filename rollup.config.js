import buble from '@rollup/plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs'

export default {
  input: 'src/main.js',
  output: {
    name: 'pins',
    file: 'dist/pins.js',
    format: 'iife',
  },
  plugins: [
    buble(),
    resolve({
      main: true,
      browser: true
    }),
    commonJS({
      include: 'node_modules/**'
    })
  ],
};

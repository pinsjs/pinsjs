import buble from '@rollup/plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs'
import { uglify } from "rollup-plugin-uglify";

export default {
  input: 'src/main.js',
  output: [
    {
      name: 'pins',
      file: 'dist/pins.js',
      format: 'iife',
      plugins: [],
      sourcemap: true
    },
    {
      name: 'pins',
      file: 'dist/pins.min.js',
      format: 'iife',
      plugins: [
        uglify()
      ],
      sourcemap: true
    },
    {
      name: 'pins',
      file: 'dist/pins.node.js',
      format: 'cjs'
    }
  ],
  plugins: [
    buble(),
    resolve({
      main: true,
      browser: true
    }),
    commonJS({
      include: 'node_modules/**'
    })
  ]
};

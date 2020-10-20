import buble from '@rollup/plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import nodent from 'rollup-plugin-nodent';
import { terser } from 'rollup-plugin-terser';
import execute from 'rollup-plugin-execute';

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
        terser()
      ],
      sourcemap: true
    },
    {
      name: 'pins',
      file: 'dist/pins.node.js',
      format: 'cjs'
    },
    {
      name: 'pins',
      file: 'dist/pins.python.js',
      format: 'iife',
      plugins: [
        execute('node ../tools/function-tracer/. -i dist/pins.python.js -o ../python/src/pins/js/pins.js -f pinDebug'),
      ]
    }
  ],
  plugins: [
    nodent({
      promises: true,
      noRuntime: true
    }),
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

import { readFileSync } from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

const PACKAGE = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));
const { name, version } = PACKAGE;

export default [
  // Non-minified build
  {
    input: 'src/index.js',
    output: {
      file: `tmp/${name}-${version}.js`,
      format: 'iife',
      sourcemap: false
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      json()
    ]
  },
  // Minified build
  {
    input: 'src/index.js',
    output: {
      file: `tmp/${name}-${version}.min.js`,
      format: 'iife',
      sourcemap: false
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      json(),
      terser({
        format: {
          comments: false
        }
      })
    ]
  }
];

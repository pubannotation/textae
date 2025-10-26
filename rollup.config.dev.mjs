import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: {
    file: 'dev/bundle.js',
    format: 'iife',
    sourcemap: 'inline',
    // jQuery is loaded separately in dev/development.html
    // Make it available as a global variable
    globals: {
      jquery: '$'
    }
  },
  // Mark jQuery as external in dev mode since it's loaded via script tag
  external: ['jquery'],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    json()
  ],
  watch: {
    clearScreen: false,
    include: 'src/**'
  }
};

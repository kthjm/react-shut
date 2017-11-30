import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import flow from 'rollup-plugin-flow'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

const NAME = 'react-shut'

export default {
  input: `src/index.js`,
  plugins: [
    flow(),
    babel({ exclude: 'node_modules/**' }),
    commonjs(),
    uglify({}, minify)
  ],
  output: {
    format: 'umd',
    file: `dist/${NAME}.min.js`,
    name: 'ReactShut',
    globals: {
      react: 'React',
      atra: 'Atra'
    }
  }
}

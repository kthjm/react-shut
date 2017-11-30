const rollup = require('rollup')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const flow = require('rollup-plugin-flow')

const NAME = 'react-shut'

rollup
  .rollup({
    input: `src/index.js`,
    plugins: [flow(), babel({ exclude: 'node_modules/**' }), commonjs()]
  })
  .then(bundle => {
    bundle.write({ format: 'cjs', file: `dist/${NAME}.cjs.js` })
    bundle.write({ format: 'es', file: `dist/${NAME}.es.js` })
  })
  .catch(err => console.error(err))

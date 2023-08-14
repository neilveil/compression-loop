import { defineConfig } from 'rollup'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import fs from 'fs'

fs.rmSync('dist', { recursive: true, force: true })

const config = defineConfig({
  watch: false,
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/compression-loop.js',
      format: 'umd',
      name: 'CompressionLoop'
    },
    {
      file: 'dist/compression-loop.common.js',
      format: 'cjs'
    },
    {
      file: 'dist/compression-loop.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    typescript({ tsconfig: './rollup.tsconfig.json' }),
    babel({
      plugins: ['@babel/plugin-transform-runtime'],
      presets: ['@babel/env'],
      exclude: ['node_modules/**'],
      babelHelpers: 'runtime'
    }),
    terser()
  ]
})

export default [config]

// rollup.config.js
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import json from 'rollup-plugin-json';

const env = 'development';
process.env.NODE_ENV = env;
process.env.BABEL_ENV = env;

export default {
    external: [
        'lodash',
        'react',
        'react-dom',
        'react-transition-group',
        'animejs',
    ],
    context: 'window',
    input: 'src/index.js',
    output: [
        {
            name: 'Chain Drive',
            file: 'dist/index.js',
            format: 'umd',
            sourcemap: true,
            globals: {
                'lodash': '_',
                'react': 'React',
                'react-dom': 'ReactDOM',
                'react-transition-group': 'react-transition-group',
                'animejs': 'anime'
            },
            exports: 'named',
        },
        {
            file: 'dist/index.module.js',
            format: 'es',
            sourcemap: true,
            globals: {
                'lodash': '_',
                'react': 'React',
                'react-dom': 'ReactDOM',
                'react-transition-group': 'react-transition-group',
                'animejs': 'anime'
            },
            exports: 'named',
        },
    ],
    plugins: [
        postcss({ modules: true }),
        babel({ exclude: 'node_modules/**', runtimeHelpers: true }),
        replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
        resolve({ extensions: [ '.mjs', '.js', '.jsx', '.json' ] }),
        commonjs({
            namedExports: {
                'node_modules/lodash/lodash.js': [
                    'each',
                    'omit',
                    'reduce',
                ]
            }
        }),
        json(),
    ],
};
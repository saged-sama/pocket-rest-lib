import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'lib/index.cjs.js',
            format: 'cjs',
            exports: 'auto',
        },
        {
            file: 'lib/index.esm.js',
            format: 'esm',
        },
    ],
    plugins: [
        resolve(),
        commonjs(),
        typescript(),
    ],
};

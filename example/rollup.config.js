// noinspection JSUnusedGlobalSymbols

import resolve from '@rollup/plugin-node-resolve'; // locate and bundle dependencies in node_modules (mandatory)

export default {
    input: 'main.js',
    output: {
        dir: 'dist',
        format: 'iife',
        // globals: {
        //     "three": "three"
        // }
    },
    plugins: [resolve()]
};
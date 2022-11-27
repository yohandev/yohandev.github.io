require('esbuild').build({
    // Bundle
    entryPoints: ['src/app.js'],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: 'www/app.js',

    // Preact
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxImportSource: 'preact',
    jsx: 'automatic',
    loader: {
        '.js': 'jsx'
    },

    // Hot-Reloading
    watch: process.argv.includes('--watch'),
});
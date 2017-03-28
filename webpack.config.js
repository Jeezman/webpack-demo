const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDashboard = require('webpack-dashboard/plugin');
const merge = require('webpack-merge');
const glob = require('glob');
const webpack = require('webpack');

const parts = require('./webpack.parts');

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
};


const commonConfig = merge([
    {
        entry: {
            app: PATHS.app,
        },
        output: {
            path: PATHS.build,
            filename: '[name].js',
        },
        plugins: [
            // new HtmlWebpackPlugin({
            //     title: 'Webpack Demo',
            // }),
            new WebpackDashboard(),
        ],
    },
    parts.lintJavascript({ include: PATHS.app }),
    parts.lintCSS({ include: PATHS.app }),
    parts.loadFonts({
        options: {
            name: '[name].[hash:8].[ext]',
        },
    }),
    parts.loadJavaScript({ include: PATHS.app }),
    parts.extractBundles([
        {
            name: 'manifest',
            minChunks: Infinity,
        },
    ]),
]); 

const productionConfig = merge([

    {
        performance: {
            hints: 'warning', //'error' or false are valid too
            maxEntrypointSize: 100000, //in bytes
            maxAssetSize: 450000, //in bytes
        },
        output: {
            chunkFilename: '[name].[chunkhash:8].js',
            filename: '[name].[chunkhash:8].js',
        },
        plugins: [
            new webpack.HashedModuleIdsPlugin(),
        ],
    },
    parts.clean(PATHS.build),
    parts.minifyJavaScript(),
    parts.minifyCSS({
        options: {
            discardComments: {
                removeAll: true,
            },
            //run cssnano in safe mode to avoid
            //potentially unsafe transformation
            safe: true,
        },
    }),
    parts.attachRevision(),
    parts.extractCSS({ 
        use: ['css-loader', parts.autoprefix()],
    }),
    parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*`, { nodir: true }),
    }),
    parts.loadSASS(),
    parts.loadImages({
        options: {
            limit: 15000,
            name: '[name].[hash:8].[ext]',
        },
    }),
    parts.generateSourceMaps({ type: 'source-map'}),
    parts.extractBundles([
        {
            name: 'vendor',

            minChunks: ({ resource }) => (
                resource &&
                resource.indexOf('node_modules') >= 0 &&
                resource.match(/\.js$/)
            ),
        },
    ]),
]);

const developmentConfig = merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
    }),
    parts.loadCSS(),
    parts.loadSASS(),
    parts.loadImages(),
    parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
]);

module.exports = (env) => {
    // if (env === 'production') {
    //     return merge(commonConfig, productionConfig);
    // }
    // return  merge(commonConfig, developmentConfig);

    const pages = [
        parts.page({ title: 'Webpack demo' }),
        parts.page({ title: 'Another demo', path: 'another' }),
    ];
    const config = env === 'production' ?
        productionConfig :
        developmentConfig;

    return pages.map(page => merge(commonConfig, config, page));
};

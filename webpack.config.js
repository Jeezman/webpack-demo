const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDashboard = require('webpack-dashboard/plugin');
const merge = require('webpack-merge');
const glob = require('glob');

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
            new HtmlWebpackPlugin({
                title: 'Webpack Demo',
            }),
            new WebpackDashboard(),
        ],
    },
    parts.lintJavascript({ include: PATHS.app }),
    parts.lintCSS({ include: PATHS.app }),
    parts.loadFonts({
        options: {
            name: '[name].[ext]',
        },
    }),
    parts.loadJavaScript({ include: PATHS.app }),
]); 

const productionConfig = merge([

    {
        entry: {
	  vendor: ['react'],
	},
    },

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
            name: '[name].[ext]',
        },
    }),
    parts.generateSourceMaps({ type: 'source-map'})
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
    if (env === 'production') {
        return merge(commonConfig, productionConfig);
    }
    return  merge(commonConfig, developmentConfig);
};

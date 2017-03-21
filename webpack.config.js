const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDashboard = require('webpack-dashboard/plugin');
const merge = require('webpack-merge');

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
]); 

const productionConfig = merge([
    parts.extractCSS({ use: 'css-loader'}),
]);

const developmentConfig = merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
    }),
    parts.loadCSS(),
]);

module.exports = (env) => {
    if (env === 'production') {
        return merge(commonConfig, productionConfig);
    }
    return  merge(commonConfig, developmentConfig);
};
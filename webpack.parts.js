const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');

exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        historyApiFallback: true,
        stats: 'errors-only',
        host,
        port,
        overlay: {
            errors: true,
            warnings: true,
        },
    },
});

exports.lintJavascript =({ include, exclude, options }) => ({
    module: {
        rules: [
            {
                test: /\.js$/,
                include,
                exclude,
                enforce: 'pre',

                loader: 'eslint-loader',
                options,
            },
        ],
    },
});

exports.loadJavaScript = ({ include, exclude }) => ({
    module: {
        rules: [
            {
                test: /\.js$/,
                include,
                exclude,

                loader: 'babel-loader',
                options: {
                    //enable caching for improved performance during dev
                    cacheDirectory: true,
                },
            },
        ],
    },
});

exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                include,
                exclude,

                use: ['style-loader', 'css-loader'],
            },
        ],
    },
});

exports.loadSASS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.scss$/,
                include,
                exclude,

                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
});

exports.autoprefix = () => ({
    loader: 'postcss-loader',
    options: {
        plugins: () => ([
            require('autoprefixer'),
        ]),
    },
});

exports.extractCSS = ({ include, exclude, use }) => {
    //output extracted CSS to a file
    const plugin = new ExtractTextPlugin({
        filename: '[name].[contenthash:8].css',
    });
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include,
                    exclude,

                    use: plugin.extract({
                        use,
                        fallback: 'style-loader',
                    }),
                },
            ],
        },
        plugins: [ plugin ],
    };
};

exports.purifyCSS = ({ paths }) => ({
    plugins: [
        new PurifyCSSPlugin({
            paths, 
            purifyOptions: {
                minify: true, //minifies css code in addition to purifyCSS
                rejected: true, //logs out removed selectors
            },
        }),
    ],
});

exports.lintCSS = ({ include, exclude }) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                include,
                exclude,
                enforce: 'pre',

                loader: 'postcss-loader',
                options: {
                    plugins: () => ([
                        require('stylelint')({
                            //ignore node_modules CSS
                            ignoreFiles: 'node_modules/**/*.css',
                        }),
                    ]),
                },
            },
        ],
    },
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg|svg)$/,
                include,
                exclude,

                use: {
                    loader: 'url-loader',
                    options,
                },
            },
        ],
    },
}); 

exports.loadFonts = ({ include, exclude, options } = {})  => ({
    module: {
        rules: [
            {
                //capture eot, ttf, woff and woff2
                test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                include,
                exclude,

                use: {
                    loader: 'file-loader',
                    options,
                },
            },
        ],
    },
});

exports.generateSourceMaps = ({ type }) => ({
    devtool: type,
});

exports.extractBundles = (bundles) => ({
    plugins: bundles.map((bundle) => (
        new webpack.optimize.CommonsChunkPlugin(bundle)
    )),
});

exports.clean = (path) => ({
    plugins: [
        new CleanWebpackPlugin([path]),
    ],
});

exports.attachRevision = () => ({
    plugins: [
        new webpack.BannerPlugin({
            banner: new GitRevisionPlugin().version(),
        }),
    ],
});

exports.minifyJavaScript = () => ({
    plugins: [
        new BabiliPlugin(),
    ],
});

exports.minifyCSS = ({ options }) => ({
    plugins: [
        new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: options,
            canPrint: false,
        }),
    ],
});

exports.page = ({
    path = '',
    template = require.resolve(
        'html-webpack-plugin/default_index.ejs'
    ),
    title,
    entry,
} = {}) => ({
    entry,
    plugins: [
        new HtmlWebpackPlugin({
            filename: `${path && path + '/'}index.html`,
            template,
            title,
        }),
    ],
});

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

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
        filename: '[name].css',
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
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './static/index.jsx',
    output: {
        filename: './index.js',
        path: path.resolve(__dirname, 'static'),
    },
    mode: 'production',
    optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [ // this avoid generating a license file
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-class-properties'],
                    },
                },
            }
        ]
    }
};
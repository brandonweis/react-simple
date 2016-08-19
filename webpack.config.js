/**
 * Created by brandon on 07/03/16.
 */
var path = require('path');

module.exports = {
    entry: ['babel-polyfill', path.normalize(__dirname + '/src/js/react/main')],
    devtool: 'cheap-module-source-map',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        chunkFilename: "[id].js"
    },
    module: {
        loaders: [
            {
                loader: 'babel',
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src', 'js')],
                // use transform-object-rest-spread to enable spread operator
                query: {
                    plugins: ['transform-runtime', 'transform-object-rest-spread'],
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
        ]
    }
};

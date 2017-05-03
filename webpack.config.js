var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
// var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        'IndexDBHelper': './src/IndexDBHelper.js',
        // 'test': './src/test.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        library: 'IndexDBHelper',
        libraryTarget: 'umd',
        umdNameDefine: true
    },
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel-loader?presets[]=es2015&presets[]=react&compact=false'
        }, {
            test: /\.less$/,
            loader: "style!css!less",
            options: {
                minimize: true
            }
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader',
            options: {
                minimize: true
            }
        }, {
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            loader: 'url-loader?limit=300000&name=[name]-[hash].[ext]'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        // new CopyWebpackPlugin([

        //     // // {output}/to/file.txt 
        //     // { from: 'from/file.txt', to: 'to/file.txt' },

        //     // // {output}/to/directory/file.txt 
        //     // { from: 'from/file.txt', to: 'to/directory' },

        //     // // Copy directory contents to {output}/ 
        //     // { from: 'from/directory' },

        //     // // Copy directory contents to {output}/to/directory/ 
        //     // { from: 'from/directory', to: 'to/directory' },

        //     // Copy glob results to /absolute/path/ 
        //     // { from: 'bundle/**/*', to: 'E:/publicJsCore/reactExample' },
        //     // { from: 'css/**/*', to: 'E:/publicJsCore/reactExample' },
        //     // { from: 'less/**/*', to: 'E:/publicJsCore/reactExample' },
        //     // { from: 'images/**/*', to: 'E:/publicJsCore/reactExample' },
        //     // { from: '*.*', to: 'E:/publicJsCore/reactExample' },
        //     // { from: 'src/**/*', to: 'E:/publicJsCore/reactExample' }



        // ]),
        //  new uglifyJsPlugin({
        //      output: {
        //         comments: false, // remove all comments
        //     },
        //     compress: {
        //         warnings: false
        //     }
        // }),
        // new CommonsChunkPlugin(({
        //     name: "common.js",
        //     // (the commons chunk name)

        //     filename: "./js/common.js",
        //     // (the filename of the commons chunk)

        //     // minChunks: 3,
        //     // (Modules must be shared between 3 entries)

        //     // chunks: ["pageA", "pageB"],
        //     // (Only use these entries)
        // }))

    ]

};
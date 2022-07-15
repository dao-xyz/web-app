/* const { override, addBabelPlugin } = require("customize-cra");
const pluginProposalDecorators = require("@babel/plugin-proposal-decorators");

module.exports = override(
    addBabelPlugin([pluginProposalDecorators, { decoratorsBeforeExport: false }])
); */

const { override, addDecoratorsLegacy, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const PROD = JSON.parse(process.env.PROD_ENV || '0');
const path = require('path');
/* module.exports = override(
    addDecoratorsLegacy(),


); */


module.exports = function override(config, env) {
    let loaders = config.resolve
    loaders.fallback = {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
        "buffer": require.resolve("buffer"),
        "orbit-db-identity-provider/src/identity-provider-interface": require.resolve("orbit-db-identity-provider/src/identity-provider-interface"),
        /*  process: require.resolve('process/browser'), */
    }
    config.module.rules = [...config.module.rules,
    {
        test: /\.m?js/,
        resolve: {
            fullySpecified: false
        }
    }
    ]

    /*   config.plugins.push(new webpack.LoaderOptionsPlugin({
          // test: /\.xxx$/, // may apply this only for some modules
          options: {
              alias: {
                  process: path.resolve(__dirname, "./node_modules/process/browser.js")
              }
          }
      })) */
    config.plugins.push(new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    }))

    config.plugins.push(new webpack.DefinePlugin({
        process: { env: {} },
    }))

    /* config.optimization = {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: {
                        keep_classnames: true,
                        keep_fnames: true,
                    },
                    mangle: {
                        keep_classnames: true,
                        keep_fnames: true
                    }
                }

            })
        ]
    } */

    /*  config.plugins.push(new webpack.DefinePlugin({
         process: ['process/browswer'],
     })) */

    /*   config.plugins.push(new webpack.ProvidePlugin({
          process: 'process/browser',
      })) */
    return config
}
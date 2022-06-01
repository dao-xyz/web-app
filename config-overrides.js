/* const { override, addBabelPlugin } = require("customize-cra");
const pluginProposalDecorators = require("@babel/plugin-proposal-decorators");

module.exports = override(
    addBabelPlugin([pluginProposalDecorators, { decoratorsBeforeExport: false }])
); */

const { override, addDecoratorsLegacy, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

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

    }
    config.module.rules = [...config.module.rules,
    {
        test: /\.m?js/,
        resolve: {
            fullySpecified: false
        }
    }
    ]
    config.plugins.push(new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    }))

    config.plugins.push(new webpack.DefinePlugin({
        process: { env: {} },
    }))

    return config
}
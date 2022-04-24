/* const { override, addBabelPlugin } = require("customize-cra");
const pluginProposalDecorators = require("@babel/plugin-proposal-decorators");

module.exports = override(
    addBabelPlugin([pluginProposalDecorators, { decoratorsBeforeExport: false }])
); */

const { override, addDecoratorsLegacy, } = require('customize-cra');
/* module.exports = override(
    addDecoratorsLegacy(),

); */
module.exports = function override(config, env) {
    let loaders = config.resolve
    loaders.fallback = {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify")
    }
    return config
}
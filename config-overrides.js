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
    console.log('override')
    let loaders = config.resolve
    loaders.fallback = {
        "crypto": require.resolve("crypto-browserify")
    }

    return config
}
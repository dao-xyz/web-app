/* const { override, addBabelPlugin } = require("customize-cra");
const pluginProposalDecorators = require("@babel/plugin-proposal-decorators");

module.exports = override(
    addBabelPlugin([pluginProposalDecorators, { decoratorsBeforeExport: false }])
); */

const { override, addDecoratorsLegacy } = require('customize-cra');
module.exports = override(
    addDecoratorsLegacy()
);
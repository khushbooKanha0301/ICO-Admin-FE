const webpack = require('webpack');

module.exports = function override(config) {
    plugins: [require("flowbite/plugin")];
    content: ["./node_modules/flowbite/**/*.js"];
    config.devtool = false;
    return config;
}
const webpack = require('webpack');

module.exports = function override(config) {
    config.devtool = false;
    return config;
}
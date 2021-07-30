function adapter() {
    try {
        var zlib = require('zlib');
        if (zlib.hasOwnProperty('brotliCompress')) {
            return zlib.brotliCompress;
        }
    } catch (err) {}

    try {
        var brotli = require('brotli');
        return function (content, options, callback) {
            var result = brotli.compress(content, options);
            callback(null, result);
        }
    } catch (err) {
        throw new Error('brotli not found. See https://github.com/mynameiswhm/brotli-webpack-plugin for details.');
    }
}

module.exports = adapter;

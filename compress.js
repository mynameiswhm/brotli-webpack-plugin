function adapter() {
    try {
        var iltorb = require('iltorb');
        return iltorb.compress;
    } catch (err) {
        try {
            var brotli = require('brotli');
            return function (content, options, callback) {
                var result = brotli.compress(content, options);
                callback(null, result);
            }
        } catch (err) {
            throw new Error('iltorb or brotli not found. See https://github.com/mynameiswhm/brotli-webpack-plugin for details.');
        }
    }
}

module.exports = adapter;

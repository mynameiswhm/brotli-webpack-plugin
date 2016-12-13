var async = require('async');
var url = require('url');

var RawSource = require('webpack-sources/lib/RawSource');

function CompressionPlugin(options) {
    options = options || {};
    this.asset = options.asset || '[path].br[query]';
    this.test = options.test || options.regExp;
    this.threshold = options.threshold || 0;
    this.minRatio = options.minRatio || 0.8;

    try {
        var brotli = require('iltorb');
    } catch (err) {
        throw new Error('iltorb not found');
    }

    var brotliOptions = {
        mode: options.hasOwnProperty('mode') ? options.mode : 0,
        quality: options.hasOwnProperty('quality') ? options.quality : 11,
        lgwin: options.hasOwnProperty('lgwin') ? options.lgwin : 22,
        lgblock: options.hasOwnProperty('lgblock') ? options.lgblock : 0,
        enable_dictionary: options.hasOwnProperty('enable_dictionary') ? options.enable_dictionary : true,
        enable_transforms: options.hasOwnProperty('enable_transforms') ? options.enable_transforms : false,
        greedy_block_split: options.hasOwnProperty('greedy_block_split') ? options.greedy_block_split : false,
        enable_context_modeling: options.hasOwnProperty('enable_context_modeling') ? options.enable_context_modeling : false
    };

    this.compress = function (content, callback) {
        brotli.compress(content, brotliOptions, callback);
    };
}
module.exports = CompressionPlugin;

CompressionPlugin.prototype.apply = function (compiler) {
    compiler.plugin('this-compilation', function (compilation) {
        compilation.plugin('optimize-assets', function (assets, callback) {
            async.forEach(Object.keys(assets), function (file, callback) {
                if (this.test && !this.test.test(file)) {
                    return callback();
                }

                var asset = assets[file];
                var content = asset.source();
                if (!Buffer.isBuffer(content)) {
                    content = new Buffer(content, 'utf-8');
                }

                var originalSize = content.length;
                if (originalSize < this.threshold) {
                    return callback();
                }

                this.compress(content, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (result.length / originalSize > this.minRatio) {
                        return callback();
                    }

                    var parse = url.parse(file);
                    var sub = {
                        file: file,
                        path: parse.pathname,
                        query: parse.query || ''
                    };

                    var newFile = this.asset.replace(/\[(file|path|query)\]/g, function (p0, p1) {
                        return sub[p1];
                    });

                    assets[newFile] = new RawSource(result);
                    callback();
                }.bind(this));
            }.bind(this), callback);
        }.bind(this));
    }.bind(this));
};

var async = require('async');
var url = require('url');

var RawSource = require('webpack-sources/lib/RawSource');

function BrotliPlugin(options) {
    options = options || {};
    this.asset = options.asset || '[path].br[query]';
    this.test = options.test || options.regExp;
    this.threshold = options.threshold || 0;
    this.minRatio = options.minRatio || 0.8;
    this.deleteOriginalAssets = options.deleteOriginalAssets || false;

    var compress = require('./compress.js')();

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
        compress(content, brotliOptions, callback);
    };
}
module.exports = BrotliPlugin;

BrotliPlugin.prototype.apply = function (compiler) {
    var emit = function (compilation, callback) {
        var assets = compilation.assets;

        async.forEach(Object.keys(assets), function (file, callback) {
            if (this.test && !this.test.test(file)) {
                return callback();
            }

            var asset = assets[file];
            var content = asset.source();
            if (!Buffer.isBuffer(content)) {
                content = Buffer.from(content, 'utf-8');
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
                    fileWithoutExt: file.split('.').slice(0, -1).join('.'),
                    ext: file.split('.').slice(-1).join(''),
                    path: parse.pathname,
                    query: parse.query || ''
                };

                var newFile = this.asset.replace(/\[(file|fileWithoutExt|ext|path|query)]/g, function (p0, p1) {
                    return sub[p1];
                });
                if (this.deleteOriginalAssets) {
                    delete assets[file];
                }
                assets[newFile] = new RawSource(result);
                callback();
            }.bind(this));
        }.bind(this), callback);
    }.bind(this);

    if (compiler.hooks) {
        const plugin = { name: 'BrotliPlugin' };
        compiler.hooks.emit.tapAsync(plugin, emit);
    } else {
        compiler.plugin('emit', emit);
    }
};

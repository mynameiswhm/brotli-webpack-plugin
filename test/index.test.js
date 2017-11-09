var BrotliPlugin = require('../index.js');
var webpack = require('webpack');
var rmRf = require('rimraf');

var OUTPUT_DIR = __dirname + '/tmp/';

function createCompiler(options) {
    var defaultOptions = {
        bail: true,
        cache: false,
        entry: __dirname + '/fixtures/entry.js',
        output: {
            path: OUTPUT_DIR,
            filename: '[name].js',
            chunkFilename: '[id].[name].js'
        },
        plugins: [
            new BrotliPlugin()
        ]
    };

    if (!Array.isArray(options)) {
        options = Object.assign({}, defaultOptions, options);
    }

    return webpack(options);
}

function compile(compiler) {
    return new Promise(function (resolve, reject) {
        compiler.run(function (err, stats) {
            if (err) return reject(err);
            resolve(stats);
        });
    });
}

describe('when applied with default settings', function () {
    beforeEach(function (done) {
        rmRf(OUTPUT_DIR, done)
    });

    afterEach(function (done) {
        rmRf(OUTPUT_DIR, done)
    });

    it('matches snapshot', function () {
        var compiler = createCompiler();

        new BrotliPlugin().apply(compiler);

        return compile(compiler).then(function (stats) {
            expect(stats.compilation.assets['main.js']);
            expect(stats.compilation.assets['main.js.br']);

            for (var file in stats.compilation.assets) {
                if (Object.prototype.hasOwnProperty.call(stats.compilation.assets, file)) {
                    expect(stats.compilation.assets[file].source()).toMatchSnapshot('default: ' + file);
                }
            }
        });
    });
});

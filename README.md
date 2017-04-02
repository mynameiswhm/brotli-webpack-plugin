# brotli plugin for webpack

This plugin compresses assets with [Brotli](https://github.com/google/brotli) compression algorithm using [iltorb](https://github.com/MayhemYDG/iltorb#brotliparams) library for serving it with [ngx_brotli](https://github.com/google/ngx_brotli) or such.

## Installation

```
npm install --save-dev brotli-webpack-plugin
```

## Usage

``` javascript
var BrotliPlugin = require('brotli-webpack-plugin');
module.exports = {
	plugins: [
		new BrotliPlugin({
			asset: '[path].br[query]',
			test: /\.(js|css|html|svg)$/,
			threshold: 10240,
			minRatio: 0.8
		})
	]
}
```

Arguments:

* `asset`: The target asset name. Defaults to `'[path].br[query]'`.
  * `[file]` is replaced with the original asset file name.
  * `[fileWithoutExt]` is replaced with the file name minus its extension, e.g. the `style` of `style.css`.
  * `[ext]` is replaced with the file name extension, e.g. the `css` of `style.css`.
  * `[path]` is replaced with the path of the original asset.
  * `[query]` is replaced with the query.
* `test`: All assets matching this RegExp are processed. Defaults to every asset.
* `threshold`: Only assets bigger than this size (in bytes) are processed. Defaults to `0`.
* `minRatio`: Only assets that compress better that this ratio are processed. Defaults to `0.8`.

Optional arguments for Brotli (see [iltorb](https://github.com/MayhemYDG/iltorb#brotliparams) doc for details):
* `mode`: Default: 0,
* `quality`: Default: 11,
* `lgwin`: Default: 22,
* `lgblock`: Default: 0,
* `enable_dictionary`: Default: true,
* `enable_transforms`: Default: false,
* `greedy_block_split`: Default: false,
* `enable_context_modeling`: Default: false

## License

Heavily copy-pasted from [webpack/compression-webpack-plugin](https://github.com/webpack/compression-webpack-plugin) by [Tobias Koppers](https://github.com/sokra).

Licensed under [MIT](./LICENSE).

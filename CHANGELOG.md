# Change Log

### 1.1.0
Added native brotli support via [zlib.brotliCompressSync](https://nodejs.org/api/zlib.html#zlib_zlib_brotlicompress_buffer_options_callback) for Node v11.7+.

### 1.0.0
Added native support for Webpack 4 hooks API (to avoid `DeprecationWarning`), along with backwards compatibility for legacy Webpack versions.

### 0.5.0
Added `deleteOriginalAssets` option to remove original files that were compressed with brotli.

### 0.4.3
Updated `iltorb`s  available configuration parameters in documentation.

### 0.4.2
Updated [iltorb](https://github.com/MayhemYDG/iltorb) to 2.0.1.

### 0.4.1
Added warning message when `iltorb` is not available.

### 0.4.0
Moved compilation from `this-compilation` to `emit` stage. See [issue #179](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/179) of [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack) for details.

### 0.3.0
Optional [brotli.js](https://github.com/devongovett/brotli.js) fallback when [iltorb](https://github.com/MayhemYDG/iltorb) is not available/couldn't be compiled.

### 0.2.0
Added support for `[fileWithoutExt]` and `[ext]` placeholders. This allows a mapping from e.g. 'style.css' to 'style.br.css', aiding use with tools that infer Content-Type from extension.

### 0.1.0
Initial release

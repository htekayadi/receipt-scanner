/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const vision = require('@google-cloud/vision');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
import multer from 'multer';
import imageUploader from './js/middleware/imageUploader';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
import jsConfig from './js/config/config.js';
const client = new vision.ImageAnnotatorClient({
  keyFilename: jsConfig.keyFilename
});
if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

const multerInstance = multer({
  storage: multer.MemoryStorage,
  fileSize: 5 * 1024 * 1024,
  fileFilter: imageUploader.filterFiles
});

// POST endpoint for getting image.
app.post(
  '/upload', 
  multerInstance.single('image'),
  imageUploader.uploadToCloud, 
  imageUploader.getVision,
);

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

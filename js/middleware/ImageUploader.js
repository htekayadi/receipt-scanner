  import Storage from '@google-cloud/storage';
  import sharp from 'sharp';
  import config from '../config/config';
  import imageTransformations from '../enums/ImageTransformations';

  const cloudStorage = Storage({
    projectId: config.projectId,
  });

  const bucketName = config.bucketName;
  const bucket = cloudStorage.bucket(bucketName);

  const getPublicImageUrl = (fileName) => {
    return 'https://storage.googleapis.com/' + bucketName + '/' + fileName;
  };

  const getSuffixedFileName = (fileName, suffix) => {
    if (!suffix || suffix === '') {
      return fileName;
    }

    const [originalFileName, extension] = fileName.split('.');
    return `${originalFileName}_${suffix}.${extension}`;
  };

  const ImageUploader = {};
  ImageUploader.uploadToCloud = (req, res, next) => {
    if (!req.file) {
      return next();
    }

    const cloudFileName = req.file.originalname;
    const imageBuffer = req.file.buffer;
    req.file.publicUrls = [];
    imageTransformations.forEach((fileProperties) => {
      const suffix = fileProperties.suffix;
      const fileName = getSuffixedFileName(cloudFileName,
                                           suffix);
      const file = bucket.file(fileName);
      const image = sharp(imageBuffer).resize(fileProperties.width, fileProperties.height);

      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype
        }
      });

      stream.on('error', (err) => {
        req.file.cloudStorageError = err;
        next(err);
      });

      stream.on('finish', () => {
        req.file['cloudStorageObject_' + suffix] = fileName;
        req.file.publicUrls.push({url: getPublicImageUrl(fileName),
          height: fileProperties.height, width: fileProperties.width
        });
        if (req.file.publicUrls.length === imageTransformations.length) {
          next();
        }
      });

      image.toBuffer((err, data) => {
        if (!err) {
          stream.end(data);
        }
      });
    });
  };

  ImageUploader.filterFiles = (req, file, callback) => {
    if (!file || !file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only Image files are allowed!'), false);
    }
    callback(null, true);
  };

  module.exports = ImageUploader;



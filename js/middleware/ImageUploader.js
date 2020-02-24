  import Storage from '@google-cloud/storage';
  import Vision from "@google-cloud/vision";
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

  const client = new Vision.ImageAnnotatorClient({
    keyFilename: config.keyFilename
  });
  
  const ImageUploader = {};
  ImageUploader.uploadToCloud = (req, res, next) => {
    if (!req.file) {
      return next();
    }

    const fileName = req.file.originalname;
    const imageBuffer = req.file.buffer;
    req.file.publicUrls = [];
    imageTransformations.forEach((fileProperties) => {
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
        req.file.publicUrls.push({url: getPublicImageUrl(fileName),
          height: fileProperties.height, width: fileProperties.width
        });
        if (req.file.publicUrls.length === imageTransformations.length) {
          next();
        }
        req.file.cloudStorageObject = fileName;
      });

      image.toBuffer((err, data) => {
        if (!err) {
          stream.end(data);
        }
      });
    });
  };

  ImageUploader.getVision = async (req, res) => {
    const data = req.body;
    if (req.file && !req.file.cloudStorageError && req.file.publicUrls && req.file.publicUrls.length > 0) {
      const [result] = await client.textDetection(`gs://${config.bucketName}/${req.file.originalname}`);
      const detections = result.textAnnotations;
      const label_array = [];
      detections.forEach(text => {
        if(!isNaN(text.description)) {
          label_array.push({number: text.description, vertices: text.boundingPoly.vertices });
        }
      });

      data.images = req.file.publicUrls;
      data.numbers = label_array;
    } else if (req.file.cloudStorageError) {
      data.error = req.file.cloudStorageError;
    }

    res.send(data);
  }

  ImageUploader.filterFiles = (req, file, callback) => {
    if (!file || !file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only Image files are allowed!'), false);
    }
    callback(null, true);
  };

  module.exports = ImageUploader;



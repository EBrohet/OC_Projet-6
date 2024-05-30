const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const uploadPath = 'images/';

const optimise = (req, res, next) => {
  try {
    const filePath = path.join(uploadPath, req.file.filename);
    const outputFilePath = path.join(
      uploadPath,
      `${path.parse(req.file.filename).name}.webp`
    );
    const outputFileName = `${path.parse(req.file.filename).name}.webp`;

    sharp.cache(false);
    sharp(filePath)
      .webp({ quality: 80 })
      .toFile(outputFilePath)
      .then(() => {
        fs.unlinkSync(filePath);
        req.file.path = outputFilePath;
        req.file.filename = outputFileName;
        next();
      })
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du traitement de l'image" });
  }
};

module.exports = optimise;
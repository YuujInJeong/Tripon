const vision = require('@google-cloud/vision');
const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs-extra');
const path = require('path');

const client = new vision.ImageAnnotatorClient();
const cacheDir = path.join(__dirname, '..', 'cache');
fs.ensureDirSync(cacheDir); 

function getHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

exports.describeImage = async (base64Buffer) => {
  //  이미지 리사이즈
  const resized = await sharp(base64Buffer).resize({ width: 1024 }).toBuffer();
  const hash = getHash(resized);

  const cachePath = path.join(cacheDir, `${hash}.json`);
  if (fs.existsSync(cachePath)) {
    console.log('✅ 캐시에서 불러옴:', hash);
    const cached = await fs.readJson(cachePath);
    return cached.labels.join(', ');
  }

  const [result] = await client.annotateImage({
    image: { content: resized },
    features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
  });

  const labels = result.labelAnnotations.map(l => l.description);
  await fs.writeJson(cachePath, { labels });

  return labels.join(', ');
};     
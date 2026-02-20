
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = path.join('public', 'assets', 'CV.P.W.B.png');
const outputPath = path.join('public', 'assets', 'CV.P.W.B.webp');

if (fs.existsSync(inputPath)) {
    sharp(inputPath)
        .webp({ quality: 90, lossless: false, effort: 6 })
        .toFile(outputPath)
        .then(() => console.log('Successfully converted CV.P.W.B.png to CV.P.W.B.webp'))
        .catch(err => console.error('Error converting image:', err));
} else {
    console.log('CV.P.W.B.png not found');
}

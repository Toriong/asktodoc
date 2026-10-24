import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve } from 'path';

async function checkImageVariance(imagePath: string): Promise<number> {
  const image = sharp(imagePath);
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  // Calculate mean
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  const mean = sum / data.length;
  
  // Calculate variance
  let varianceSum = 0;
  for (let i = 0; i < data.length; i++) {
    const diff = data[i] - mean;
    varianceSum += diff * diff;
  }
  const variance = varianceSum / data.length;
  const stddev = Math.sqrt(variance);
  
  return stddev;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: tsx check-variance.ts <image-path>');
    process.exit(1);
  }
  
  const imagePath = args[0];
  const stddev = await checkImageVariance(imagePath);
  console.log(`Standard deviation: ${stddev.toFixed(2)}`);
  
  // Threshold: if stddev < 5, image is likely blank/uniform
  if (stddev < 5) {
    console.log('⚠️  WARNING: Image appears to be nearly uniform (likely blank)');
    process.exit(1);
  } else {
    console.log('✓ Image has sufficient variance');
  }
}

main().catch(console.error);

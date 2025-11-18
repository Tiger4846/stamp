import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function uploadQRCode(
  buffer: Buffer,
  phone: string
): Promise<string> {
  const fileName = `qr-codes/${phone}.png`;
  
  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: 'image/png',
    })
  );

  // Return public URL
  return `${process.env.R2_PUBLIC_URL}/${fileName}`;
}

export default r2Client;

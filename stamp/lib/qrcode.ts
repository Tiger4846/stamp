import QRCode from 'qrcode';
import { uploadQRCode } from './r2';

export async function generateAndUploadQRCode(phone: string): Promise<string> {
  // Generate QR code from phone number
  const qrCodeBuffer = await QRCode.toBuffer(phone, {
    type: 'png',
    width: 512,
    margin: 2,
    errorCorrectionLevel: 'H',
  });

  // Upload to Cloudflare R2
  const qrCodeUrl = await uploadQRCode(qrCodeBuffer, phone);

  return qrCodeUrl;
}

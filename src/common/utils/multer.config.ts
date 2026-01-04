import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// ฟังก์ชันนี้รับชื่อ folderName เข้ามา เพื่อให้แต่ละ Module เลือกที่เก็บเองได้
export const multerConfig = (folderName: string = 'default'): MulterOptions => {
  return {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        // สร้าง path ตาม folderName ที่ส่งเข้ามา
        const uploadPath = join(process.cwd(), 'uploads', folderName);

        // เช็คว่ามีโฟลเดอร์ไหม ถ้าไม่มีให้สร้าง
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (_req, file, cb) => {
        // ตั้งชื่อไฟล์ logic เดิม
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  };
};
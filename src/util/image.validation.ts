import { BadRequestException } from '@nestjs/common';
import * as path from 'path';

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
const maxSize = 5 * 1024 * 1024; // 5 MB

export function validateImage(image: Express.Multer.File): boolean {

    if (!image.mimetype.startsWith('image/')) {
        throw new BadRequestException('File is not an image');
    }
    const fileExtension = path.extname(image.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        throw new BadRequestException('Invalid file extension');
    }
    if (image.size > maxSize) {
        throw new BadRequestException('File is too large');
    }

    return true;
};
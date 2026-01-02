import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PeopleService } from './people.service';
import { People } from './entities/people.entity';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  async findAll(): Promise<People[]> {
    return this.peopleService.findAll();
  }

  @Post('search')
  async findByName(@Body() body: { name: string }): Promise<People[]> {
    return this.peopleService.findByNameandNickname(body.name);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'people');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Body()
    body: { name: string; nickname?: string; phone_number: string },
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<People> {
    if (!body?.name || !body?.phone_number) {
      throw new BadRequestException('name and phone_number are required');
    }

    const imageUrl = file ? `/uploads/people/${file.filename}` : undefined;
    return this.peopleService.create({
      name: body.name,
      nickname: body.nickname,
      phone_number: body.phone_number,
      image_url: imageUrl,
    });
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PeopleService } from './people.service';
import { People } from './entities/people.entity';
import { multerConfig } from 'src/common/utils/multer.config';

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
    FileInterceptor('image', multerConfig('people'))
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

 //====================================================== PUT AND DELETE ======================================================//

  @Put(':id')
    @UseInterceptors(
    FileInterceptor('image', multerConfig('people')) 
  )
  async update(
    @Param('id', ParseIntPipe) id: number, // รับ ID จาก URL เช่น /people/1
    @Body() body: { name: string; nickname?: string; phone_number: string },
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<People> {
    const imageUrl = file ? `/uploads/people/${file.filename}` : undefined;
    
    // ส่งไปให้ Service
    return this.peopleService.update(id, {
      name: body.name,
      nickname: body.nickname,
      phone_number: body.phone_number,
      image_url: imageUrl,
    });
  }
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.peopleService.delete(id);
  }
}

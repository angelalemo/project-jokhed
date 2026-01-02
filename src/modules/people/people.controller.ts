import { Controller, Get, Post, Body } from '@nestjs/common';
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
}

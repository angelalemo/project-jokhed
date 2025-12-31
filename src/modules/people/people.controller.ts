import { Controller, Get, Param, Query } from '@nestjs/common';
import { PeopleService } from './people.service';
import { People } from './entities/people.entity';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  async findAll(): Promise<People[]> {
    return this.peopleService.findAll();
  }

  @Get('phone')
  async findByPhone(@Query('number') phoneNumber: string): Promise<People> {
    return this.peopleService.findByPhoneNumber(phoneNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<People> {
    return this.peopleService.findOne(id);
  }
}

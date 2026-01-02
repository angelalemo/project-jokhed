import { Injectable, NotFoundException } from '@nestjs/common';
import { PeopleRepository } from './people.repository';
import { People } from './entities/people.entity';

@Injectable()
export class PeopleService {
  constructor(private readonly peopleRepository: PeopleRepository) {}

  /**Get all people*/
  async findAll(): Promise<People[]> {
    return this.peopleRepository.findAll();
  }

  /**Get people by Name&Nickname*/
  async findByNameandNickname(Name: string): Promise<People[]> {
    const people = await this.peopleRepository.findOne(Name);
    if (people.length === 0) {
      throw new NotFoundException(`Person with Name ${Name} not found`);
    }
    return people;
  }
}

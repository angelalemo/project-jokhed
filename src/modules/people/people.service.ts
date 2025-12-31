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

  /**Get one person by ID*/
  async findOne(id: string): Promise<People> {
    const person = await this.peopleRepository.findOne(id);
    
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
    
    return person;
  }

  /* Get one person by phone number*/
  async findByPhoneNumber(phoneNumber: string): Promise<People> {
    const person = await this.peopleRepository.findByPhoneNumber(phoneNumber);
    
    if (!person) {
      throw new NotFoundException(`Person with phone number ${phoneNumber} not found`);
    }
    
    return person;
  }
}

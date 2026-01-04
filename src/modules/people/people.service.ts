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

  async create(payload: {
    name: string;
    nickname?: string;
    phone_number: string;
    image_url?: string;
  }): Promise<People> {
    return this.peopleRepository.create(payload);
  }
//====================================================== PUT AND DELETE ======================================================//
  async update(id: number, payload: any): Promise<People> {
    const updatedPerson = await this.peopleRepository.update(id, payload);
    if (!updatedPerson) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
    return updatedPerson;
  }

  async delete(id: number): Promise<void> {
    const isDeleted = await this.peopleRepository.delete(id);
    if (!isDeleted) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
  }
}

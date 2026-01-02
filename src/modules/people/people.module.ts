import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { PeopleRepository } from './people.repository';

@Module({
  imports: [MulterModule.register({})],
  controllers: [PeopleController],
  providers: [PeopleService, PeopleRepository],
  exports: [PeopleService],
})
export class PeopleModule {}

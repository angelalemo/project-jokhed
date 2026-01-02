import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { People } from './entities/people.entity';

@Injectable()
export class PeopleRepository implements OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    const dbConfig = {
      host: this.configService.get('DB_HOST', 'localhost'),
      port: parseInt(this.configService.get('DB_PORT', '5432'), 10),
      database: this.configService.get('DB_NAME', 'peopledatabase'),
      user: this.configService.get('DB_USER', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'postgres'),
    };
    
    this.pool = new Pool(dbConfig);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  
  async findAll(): Promise<People[]> {
    const query = 'SELECT * FROM people ORDER BY created_at DESC';
    const result = await this.pool.query(query);
    return result.rows.map((row) => new People(row));
  }

  /** Get people by Name&Nickname*/
  async findOne(Name: string): Promise<People[]> {
    const query = 'SELECT * FROM people WHERE LOWER(name) = LOWER($1) OR LOWER(nickname) = LOWER($1) ORDER BY created_at DESC';
    const values = [Name];
    const result = await this.pool.query(query, values);  
    return result.rows.map((row) => new People(row));
  }

  async create(payload: {
    name: string;
    nickname?: string;
    phone_number: string;
    image_url?: string;
  }): Promise<People> {
    const query = `
      INSERT INTO people (name, nickname, phone_number, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      payload.name,
      payload.nickname ?? null,
      payload.phone_number,
      payload.image_url ?? null,
    ];
    const result = await this.pool.query(query, values);
    return new People(result.rows[0]);
  }

}

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
    
    console.log('Database Config:', dbConfig);
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

  /**
   * Get one person by ID
   */
  async findOne(id: string): Promise<People | null> {
    const query = 'SELECT * FROM people WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new People(result.rows[0]);
  }

  /**
   * Get one person by phone number
   */
  async findByPhoneNumber(phoneNumber: string): Promise<People | null> {
    const query = 'SELECT * FROM people WHERE phone_number = $1';
    const result = await this.pool.query(query, [phoneNumber]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new People(result.rows[0]);
  }
}

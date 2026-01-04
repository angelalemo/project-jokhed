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

//====================================================== UPDATE AND DELETE ======================================================//
  async update(id: number, payload: { name: string; nickname?: string; phone_number: string; image_url?: string }): Promise<People | null> {
    const query = `
      UPDATE people 
      SET name = $1, nickname = $2, phone_number = $3, image_url = COALESCE($4, image_url)
      WHERE id = $5
      RETURNING *
    `;
    // COALESCE($4, image_url) แปลว่า ถ้าส่งรูปใหม่มาให้ใช้รูปใหม่ ถ้าไม่ส่ง ($4 เป็น null) ให้ใช้รูปเดิมใน DB
    
    const values = [
      payload.name,
      payload.nickname ?? null,
      payload.phone_number,
      payload.image_url ?? null, 
      id
    ];

    const result = await this.pool.query(query, values);
    if (result.rows.length === 0) return null; // หา ID ไม่เจอ
    return new People(result.rows[0]);
  }

  // เพิ่มส่วน Delete
  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM people WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    // rowCount คือจำนวนแถวที่ถูกลบ ถ้า > 0 แปลว่าลบสำเร็จ
    return (result.rowCount ?? 0) > 0;
  }

}

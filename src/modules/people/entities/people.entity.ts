export class People {
  id: string;
  name: string;
  nickname?: string;
  phone_number: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<People>) {
    Object.assign(this, partial);
  }
}

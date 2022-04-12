import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const cs = new ConfigService();

export const ELK_USER = cs.get<string>('ELK_USER');
export const ELK_PASSWORD = cs.get<string>('ELK_PASSWORD');
export const ELK_URL = cs.get<string>('ELK_URL');

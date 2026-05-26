import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import { MainSeeder } from 'src/model/seeds/main.seeder';

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.PG_Host,
  port: 5432,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_Databse,
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  extra: {
    options: '-c timezone=UTC',
  },
  factories: [],
  seeds: [MainSeeder], // Keep PostgreSQL seeders here
};
export default options;
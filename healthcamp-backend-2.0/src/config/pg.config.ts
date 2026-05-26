import { TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config();

const databaseConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: process.env.PG_Host,
    port: parseInt(process.env.PG_PORT) || 5432, // Better to use the env port
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_Databse,
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    // Change this part below:
    ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false, 
    extra: {
        "options": "-c timezone=UTC"
    }
}; 

export default databaseConfig;
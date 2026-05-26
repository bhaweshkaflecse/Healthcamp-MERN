import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { adminEntity } from '../sql/admin.entity';
import { deptType } from 'src/helper/types/index.type';
import * as argon from 'argon2';
import { MongoClient } from 'mongodb';
import { serviceEntity } from '../sql/service.entity';
import { services, admins } from '../../helper/data/data';
import { AttributeEntity } from '../sql/attribute.entity';

// Ensure environment variables are loaded
require('dotenv').config();

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const adminRepository = dataSource.getRepository(adminEntity);
    const serviceRepository = dataSource.getRepository(serviceEntity);

    const mongoClient = new MongoClient(process.env.MONGO_CONNECTION_STRING);
    await mongoClient.connect();
    const db = mongoClient.db();

    console.log('Admin seeding....');
    await this.seedAdmin(dataSource, db);
    console.log('Admin seed completed.');

    console.log('Service seeding...');
    const allServices = await Promise.all(
      services.map(async (service) => {
        const newService = new serviceEntity();
        newService.name = service.title;
        newService.description = service.description;
        newService.attributes = await this.mapToAttributeEntity(service.attributes);
        return newService;
      }),
    );

    await serviceRepository.save(allServices);
    console.log('Service seeding completed.');

    await mongoClient.close();
  }

  private async mapToAttributeEntity(attributes: string[]) {
    return Promise.all(
      attributes.map((attribut: string) => {
        const attribute = new AttributeEntity();
        attribute.name = attribut;
        return attribute;
      }),
    );
  }

  private async seedAdmin(dataSource: DataSource, db: any) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // Ensure 'auths' collection exists
      const collections = await db.listCollections({ name: 'auths' }).toArray();
      if (collections.length === 0) {
        await db.createCollection('auths');
        console.log("'auths' collection created in MongoDB.");
      } else {
        console.log("'auths' collection already exists.");
      }

      const authCollection = db.collection('auths');

      for (const admin of admins) {
        const newAdmin = queryRunner.manager.create(adminEntity, {
          name: admin.name,
          email: admin.email,
          contact: admin.contact,
          address: admin.address,
          department: admin.department as deptType,
        });

        const savedAdmin = await queryRunner.manager.save(newAdmin);
        console.log('Admin saved to PostgreSQL with ID:', savedAdmin.id);

        const hashedPassword = await argon.hash(admin.password);

        const result = await authCollection.insertOne({
          userID: savedAdmin.id,
          password: hashedPassword,
          rToken: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        if (!result.acknowledged) {
          throw new Error(`Failed to insert auth record for admin ID: ${savedAdmin.id}`);
        }

        console.log(`Auth record created for admin ID: ${savedAdmin.id}`);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

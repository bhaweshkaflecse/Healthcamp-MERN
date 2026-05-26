import 'dotenv/config';
import { DataSource } from 'typeorm';
import { deptType } from 'src/helper/types/index.type';
import * as argon from 'argon2';
import { MongoClient } from 'mongodb';
import typeormConfig from 'src/config/seeder.config';
import { adminEntity } from '../sql/admin.entity';

const truncateAdminTable = async (dataSource: DataSource) => {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const tableName = dataSource.getMetadata(adminEntity).tableName;
    await dataSource.query(`TRUNCATE TABLE "${tableName}" CASCADE`);
    console.log(`✅ Table "${tableName}" truncated successfully with CASCADE.`);
  } catch (error) {
    console.error('❌ Error during truncating admin table:', error);
  }
};

async function runSuperAdminSeeder() {
  const businessHeadEmail = process.env.Business_Head_Email;
  const mongoUri = process.env.MONGO_CONNECTION_STRING;

  if (!businessHeadEmail || !mongoUri) {
    console.error('❌ Missing required environment variables.');
    process.exit(1);
  }

  const mongoClient = new MongoClient(mongoUri);
  const dataSource = new DataSource(typeormConfig);

  try {
    await mongoClient.connect();
    await dataSource.initialize();

    const db = mongoClient.db();
    const authCollection = db.collection('auths');

    // Ensure 'auths' collection exists and is cleared
    const collections = await db.listCollections({ name: 'auths' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('auths');
      console.log('🆕 "auths" collection created in MongoDB.');
    }
    const adminRepository = dataSource.getRepository(adminEntity);

    const isAdminExist = await adminRepository.findOne({
      where: {
        email: 'businesshead@gmail.com',
        department: deptType.businessHead
      }
    });
    console.log(isAdminExist)
    if (!isAdminExist) {
      const admin = await adminRepository.findOne({
        where: {
          department: deptType.businessHead
        }
      });
      if (admin) {
        adminRepository.update({ id: admin.id }, { email: businessHeadEmail });
        console.log("Bussiness head email updated.");
        return
      }

    }


    await authCollection.deleteMany({});
    console.log('🧹 "auths" collection cleared.');

    // Truncate admin table in PostgreSQL
    await truncateAdminTable(dataSource);

    const newAdmin = adminRepository.create({
      name: 'Business Head',
      email: businessHeadEmail,
      contact: 9800898008,
      address: 'Kathmandu',
      department: deptType.businessHead,
    });

    const savedAdmin = await adminRepository.save(newAdmin);
    console.log('✅ Super admin saved to PostgreSQL:', savedAdmin.id);

    const hashedPassword = await argon.hash('password@123');
    await authCollection.insertOne({
      userID: savedAdmin.id.toString(),
      password: hashedPassword,
      rToken: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ Super admin auth saved to MongoDB.');
  } catch (error) {
    console.error('❌ Error in super admin seeding:', error);
  } finally {
    await mongoClient.close();
    await dataSource.destroy();
    process.exit();
  }
}

runSuperAdminSeeder();

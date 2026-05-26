
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import options from 'src/config/seeder.config';

const datasource = new DataSource(options);

datasource
  .initialize()
  .then(async () => {
    // await datasource.synchronize(true);//this will wipe all the data
    await runSeeders(datasource);
    process.exit();
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
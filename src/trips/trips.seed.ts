import { Seeder } from 'typeorm-extension';
import { Rider } from './entities/rider.entity';
import { DataSource } from 'typeorm';
import { Driver } from './entities/driver.entity';

export default class TripsSeed implements Seeder {
  public async run(dataSource: DataSource) {
    const riderRepository = dataSource.getRepository(Rider);
    await riderRepository.insert([
      {
        name: 'Pepito',
        email: 'pepito@mail.com',
      },
      {
        name: 'Juan',
        email: 'juan@mail.com',
      },
      {
        name: 'Maria',
        email: 'maria@mail.com',
      },
    ]);
    const driverRepository = dataSource.getRepository(Driver);
    await driverRepository.insert([
      {
        name: 'Johana',
      },
      {
        name: 'Diego',
      },
    ]);
  }
}

import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Rider } from './entities/rider.entity';
import { DataSource } from 'typeorm';

export default class TripsSeed implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    // const repository = dataSource.getRepository(Rider);
    // await repository.insert([
    //   {
    //     name: 'Pepito',
    //   },
    // ]);
    const userFactory = await factoryManager.get(Rider);
    await userFactory.saveMany(2);
  }
}

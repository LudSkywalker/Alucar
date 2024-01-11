import { setSeederFactory } from 'typeorm-extension';
import { Rider } from './entities/rider.entity';

export default setSeederFactory(Rider, (faker) => {
  const rider = new Rider();
  rider.name = faker.person.firstName();
  return rider;
});

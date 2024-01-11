import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TripsModule } from './trips/trips.module';
import { ormOptions } from './orm.options';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormOptions),
    TripsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TripsModule } from './trips/trips.module';
import { ormOptions } from './orm.options';
import { ormTestOptions } from './ormTest.options';

ConfigModule.forRoot({
  isGlobal: true,
});
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(
      process.env.NODE_ENV == 'test' ? ormTestOptions : ormOptions,
    ),
    TripsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

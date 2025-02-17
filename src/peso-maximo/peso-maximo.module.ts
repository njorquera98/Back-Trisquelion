import { Module } from '@nestjs/common';
import { PesoMaximoService } from './peso-maximo.service';
import { PesoMaximoController } from './peso-maximo.controller';
import { PesoMaximo } from './entities/peso-maximo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PesoMaximo])],
  controllers: [PesoMaximoController],
  providers: [PesoMaximoService],
})
export class PesoMaximoModule { }

import { Module } from '@nestjs/common';
import { BonosService } from './bonos.service';
import { BonosController } from './bonos.controller';
import { PacientesModule } from 'src/pacientes/pacientes.module';
import { Bono } from './entities/bono.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Bono]), PacientesModule],
  controllers: [BonosController],
  providers: [BonosService],
})
export class BonosModule { }

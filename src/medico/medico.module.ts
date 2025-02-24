import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { MedicoController } from './medico.controller';
import { Medico } from './entities/medico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Medico])],
  controllers: [MedicoController],
  providers: [MedicoService],
  exports: [TypeOrmModule]
})
export class MedicoModule { }

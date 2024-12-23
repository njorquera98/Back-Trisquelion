import { Injectable } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private pacientesRepository: Repository<Paciente>
  ) { }

  create(createPacienteDto: CreatePacienteDto) {
    return this.pacientesRepository.save(createPacienteDto)
  }

  findAll() {
    return this.pacientesRepository.find();
  }

  findOne(paciente_id: number) {
    return this.pacientesRepository.findOneBy({ paciente_id });
  }

  async findActivos(): Promise<Paciente[]> {
    return this.pacientesRepository.find({ where: { activo: true } });
  }

  update(id: number, updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesRepository.update(id, updatePacienteDto)
  }

  remove(id: number) {
    return `This action removes a #${id} paciente`;
  }
}

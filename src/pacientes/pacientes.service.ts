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
    return this.pacientesRepository.save(createPacienteDto);
  }

  // Modificación de la función findAll para que acepte un parámetro de filtro 'activo'
  findAll(activo?: boolean) {
    // Si 'activo' está definido, filtramos pacientes según su estado
    if (activo !== undefined) {
      return this.pacientesRepository.find({
        where: { activo } // Filtra según el valor de 'activo' (true o false)
      });
    }
    // Si no se pasa 'activo', retorna todos los pacientes sin filtro
    return this.pacientesRepository.find();
  }

  findOne(paciente_id: number) {
    return this.pacientesRepository.findOneBy({ paciente_id });
  }

  update(id: number, updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesRepository.update(id, updatePacienteDto);
  }

  remove(id: number) {
    return `This action removes a #${id} paciente`;
  }
}


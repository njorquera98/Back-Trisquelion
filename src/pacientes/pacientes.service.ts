import { Injectable, NotFoundException } from '@nestjs/common';
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

  async update(id: number, updatePacienteDto: UpdatePacienteDto) {
    const paciente = await this.pacientesRepository.findOneBy({ paciente_id: id });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    // Asigna los valores del DTO al paciente encontrado
    Object.assign(paciente, updatePacienteDto);

    // Guarda el paciente actualizado
    return await this.pacientesRepository.save(paciente);
  }

  remove(id: number) {
    return `This action removes a #${id} paciente`;
  }
}


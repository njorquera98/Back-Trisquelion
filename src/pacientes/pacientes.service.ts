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

  // Modificación de la función findAll para ordenar siempre por apellido
  findAll(activo?: boolean) {
    const queryOptions: any = {
      order: { apellido: 'ASC' } // Siempre ordena por apellido de forma ascendente
    };

    if (activo !== undefined) {
      queryOptions.where = { activo }; // Filtra según el valor de 'activo' (true o false)
    }

    // Retorna los pacientes con el filtro y el orden por apellido
    return this.pacientesRepository.find(queryOptions);
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


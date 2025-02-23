import { Injectable } from '@nestjs/common';
import { CreateAntecedenteDto } from './dto/create-antecedente.dto';
import { UpdateAntecedenteDto } from './dto/update-antecedente.dto';
import { Antecedente } from './entities/antecedente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Injectable()
export class AntecedenteService {
  constructor(
    @InjectRepository(Antecedente)
    private antecedenteRepository: Repository<Antecedente>,

    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) { }

  async create(createDto: CreateAntecedenteDto): Promise<Antecedente> {
    // Buscar el paciente por su paciente_id
    const paciente = await this.pacienteRepository.findOne({ where: { paciente_id: createDto.paciente_fk } });

    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    // Crear el antecedente
    const antecedente = this.antecedenteRepository.create({
      ...createDto,
      paciente, // Asignamos el paciente encontrado
      fechaRegistro: new Date(createDto.fechaRegistro), // Convertir el string a Date
    });

    return await this.antecedenteRepository.save(antecedente);
  }

  async findAllByPacienteId(paciente_fk: number): Promise<Antecedente[]> {
    // Buscar el paciente por su paciente_id
    const paciente = await this.pacienteRepository.findOne({ where: { paciente_id: paciente_fk } });

    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    // Obtener los antecedentes
    return this.antecedenteRepository.find({ where: { paciente } });
  }

  async findOne(id: number): Promise<Antecedente> {
    // Buscar el antecedente por su ID
    const antecedente = await this.antecedenteRepository.findOne({ where: { antecedente_id: id } });

    if (!antecedente) {
      throw new Error('Antecedente no encontrado');
    }

    return antecedente;
  }

  async update(id: number, createDto: CreateAntecedenteDto): Promise<Antecedente> {
    // Buscar el antecedente
    const antecedente = await this.antecedenteRepository.findOne({ where: { antecedente_id: id } });

    if (!antecedente) {
      throw new Error('Antecedente no encontrado');
    }

    // Buscar el paciente por su paciente_id
    const paciente = await this.pacienteRepository.findOne({ where: { paciente_id: createDto.paciente_fk } });

    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    // Actualizar los valores
    antecedente.paciente = paciente;
    antecedente.tipo = createDto.tipo;
    antecedente.descripcion = createDto.descripcion;
    antecedente.tieneAntecedente = createDto.tieneAntecedente;
    antecedente.fechaRegistro = new Date(createDto.fechaRegistro); // Convertir el string a Date

    // Guardar el antecedente actualizado
    await this.antecedenteRepository.save(antecedente);

    return antecedente;
  }

  remove(id: number) {
    return `This action removes a #${id} antecedente`;
  }
}

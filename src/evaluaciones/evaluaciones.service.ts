import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Evaluacion } from './entities/evaluacion.entity';

@Injectable()
export class EvaluacionesService {
  constructor(
    @InjectRepository(Evaluacion)
    private readonly evaluacionesRepository: Repository<Evaluacion>,
    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>,
  ) { }

  // Crear evaluación
  async create(createEvaluacionDto: CreateEvaluacionDto): Promise<Evaluacion> {
    const paciente = await this.pacientesRepository.findOne({ where: { paciente_id: createEvaluacionDto.paciente_fk } });
    if (!paciente) {
      throw new Error(`Paciente con ID ${createEvaluacionDto.paciente_fk} no encontrado`);
    }

    const evaluacion = this.evaluacionesRepository.create({
      ...createEvaluacionDto,
      paciente,
    });

    return this.evaluacionesRepository.save(evaluacion);
  }

  // Obtener todas las evaluaciones
  async findAll(): Promise<Evaluacion[]> {
    return this.evaluacionesRepository.find({ relations: ['paciente'] });
  }

  // Obtener una evaluación por su ID
  async findOne(id: number): Promise<Evaluacion> {
    const evaluacion = await this.evaluacionesRepository.findOne({ where: { evaluacion_id: id }, relations: ['paciente'] });
    if (!evaluacion) {
      throw new Error(`Evaluación con ID ${id} no encontrada`);
    }
    return evaluacion;
  }

  // Obtener la última evaluación de un paciente
  async getLastEvaluacionByPaciente(pacienteId: number): Promise<Evaluacion> {
    return await this.evaluacionesRepository.findOne({
      where: { paciente: { paciente_id: pacienteId } },  // Accedemos a la relación paciente
      order: { fechaIngreso: 'DESC' },
    });
  }

  // Actualizar evaluación
  async update(id: number, updateEvaluacionDto: UpdateEvaluacionDto): Promise<Evaluacion> {
    const evaluacion = await this.findOne(id);
    if (!evaluacion) {
      throw new Error(`Evaluación con ID ${id} no encontrada`);
    }

    Object.assign(evaluacion, updateEvaluacionDto);

    return this.evaluacionesRepository.save(evaluacion);
  }

  // Eliminar evaluación
  async remove(id: number): Promise<void> {
    const evaluacion = await this.findOne(id);
    if (!evaluacion) {
      throw new Error(`Evaluación con ID ${id} no encontrada`);
    }

    await this.evaluacionesRepository.remove(evaluacion);
  }
}


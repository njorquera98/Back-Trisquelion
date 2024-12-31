import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluacion } from './entities/evaluacion.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';

@Injectable()
export class EvaluacionesService {
  constructor(
    @InjectRepository(Evaluacion)
    private readonly evaluacionRepository: Repository<Evaluacion>,
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) { }

  async create(crearEvaluacionDto: CreateEvaluacionDto): Promise<Evaluacion> {
    const { paciente_fk, ...evaluacionData } = crearEvaluacionDto;

    // Verificar que el paciente existe
    const paciente = await this.pacienteRepository.findOne({
      where: { paciente_id: paciente_fk },
    });

    if (!paciente) {
      throw new Error(`Paciente con id ${paciente_fk} no encontrado`);
    }

    // Crear la evaluación y asociarla al paciente
    const evaluacion = this.evaluacionRepository.create({ ...evaluacionData, paciente });
    return this.evaluacionRepository.save(evaluacion);
  }

  async findAll(): Promise<Evaluacion[]> {
    return this.evaluacionRepository.find({ relations: ['paciente'] });
  }

  async findOne(id: number): Promise<Evaluacion | null> {
    return this.evaluacionRepository.findOne({ where: { evaluacion_id: id } });
  }

  async findLastByPaciente(pacienteId: number): Promise<Evaluacion | null> {
    return this.evaluacionRepository.findOne({
      where: { paciente: { paciente_id: pacienteId } },
      relations: ['paciente'],
      order: { fechaIngreso: 'DESC' }, // Ordenar por fecha de ingreso en orden descendente
    });
  }

  async update(evaluacionId: number, updateEvaluacionDto: Partial<CreateEvaluacionDto>): Promise<Evaluacion> {
    const evaluacion = await this.evaluacionRepository.findOne({
      where: { evaluacion_id: evaluacionId },
      relations: ['paciente'],
    });

    if (!evaluacion) {
      throw new Error(`Evaluación con id ${evaluacionId} no encontrada`);
    }

    // Actualizar los campos que vienen en el DTO
    Object.assign(evaluacion, updateEvaluacionDto);

    return this.evaluacionRepository.save(evaluacion);
  }

  async remove(evaluacionId: number): Promise<string> {
    const evaluacion = await this.evaluacionRepository.findOne({ where: { evaluacion_id: evaluacionId } });

    if (!evaluacion) {
      throw new Error(`Evaluación con id ${evaluacionId} no encontrada`);
    }

    await this.evaluacionRepository.remove(evaluacion);
    return `Evaluación con id ${evaluacionId} eliminada correctamente`;
  }
}


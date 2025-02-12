import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluacion } from './entities/evaluacion.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Bono } from 'src/bonos/entities/bono.entity';  // Asegúrate de importar la entidad de Bono
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';

@Injectable()
export class EvaluacionesService {
  constructor(
    @InjectRepository(Evaluacion)
    private readonly evaluacionRepository: Repository<Evaluacion>,
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(Bono)
    private readonly bonoRepository: Repository<Bono>,  // Inyectamos el repositorio de Bono
  ) { }

  async create(crearEvaluacionDto: CreateEvaluacionDto): Promise<Evaluacion> {
    const { paciente_fk, bono_fk, ...evaluacionData } = crearEvaluacionDto;  // Usamos bono_fk como en el DTO

    // Verificar que el paciente existe
    const paciente = await this.pacienteRepository.findOne({
      where: { paciente_id: paciente_fk },
    });

    if (!paciente) {
      throw new Error(`Paciente con id ${paciente_fk} no encontrado`);
    }

    // Verificar que el bono existe
    const bono = await this.bonoRepository.findOne({
      where: { bono_id: bono_fk },
    });

    if (!bono) {
      throw new Error(`Bono con id ${bono_fk} no encontrado`);
    }

    // Crear la evaluación y asociarla al paciente y bono
    const evaluacion = this.evaluacionRepository.create({
      ...evaluacionData,
      paciente, bono,
    });

    return this.evaluacionRepository.save(evaluacion);
  }

  async findAll(): Promise<Evaluacion[]> {
    return this.evaluacionRepository.find({ relations: ['paciente', 'bono'] });  // Incluimos la relación con Bono
  }

  async findOne(id: number): Promise<Evaluacion | null> {
    return this.evaluacionRepository.findOne({
      where: { evaluacion_id: id },
      relations: ['paciente', 'bono'],  // Incluimos la relación con Bono
    });
  }

  async findLastByPaciente(pacienteId: number): Promise<Evaluacion | null> {
    return this.evaluacionRepository.findOne({
      where: { paciente: { paciente_id: pacienteId } },
      relations: ['paciente', 'bono'],  // Incluimos la relación con Bono
      order: { evaluacion_id: 'DESC' }, // Ordenar por ID en orden descendente
    });
  }

  async findAllByPaciente(pacienteId: number): Promise<Evaluacion[]> {
    return this.evaluacionRepository.find({
      where: { paciente: { paciente_id: pacienteId } },
      relations: ['paciente', 'bono'], // Incluimos la relación con paciente y bono
      order: { evaluacion_id: 'DESC' }, // Ordenar las evaluaciones por fecha de ingreso
    });
  }

  async update(evaluacionId: number, updateEvaluacionDto: Partial<CreateEvaluacionDto>): Promise<Evaluacion> {
    const evaluacion = await this.evaluacionRepository.findOne({
      where: { evaluacion_id: evaluacionId },
      relations: ['paciente', 'bono'],  // Incluimos la relación con Bono
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


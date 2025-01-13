import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sesion } from './entities/sesion.entity';
import { Repository } from 'typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Bono } from 'src/bonos/entities/bono.entity';
import { Evaluacion } from 'src/evaluaciones/entities/evaluacion.entity';

@Injectable()
export class SesionesService {
  constructor(
    @InjectRepository(Sesion)
    private readonly sesionesRepository: Repository<Sesion>,
    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>,
    @InjectRepository(Bono)
    private readonly bonosRepository: Repository<Bono>,
    @InjectRepository(Evaluacion)
    private readonly evalucionesRepository: Repository<Evaluacion>
  ) { }

  async create(createSesionDto: CreateSesionDto): Promise<Sesion> {
    const { evaluacion_fk, bono_fk, paciente_fk, ...sesionData } = createSesionDto;

    // Buscar la evaluación asociada
    const evaluacion = await this.evalucionesRepository.findOne({ where: { evaluacion_id: evaluacion_fk } });
    if (!evaluacion) {
      throw new NotFoundException(`Evaluación con ID ${evaluacion_fk} no encontrada`);
    }

    // Buscar el bono asociado
    const bono = await this.bonosRepository.findOne({ where: { bono_id: bono_fk } });
    if (!bono) {
      throw new NotFoundException(`Bono con ID ${bono_fk} no encontrado`);
    }

    // Validar sesiones disponibles en el bono
    if (bono.sesionesDisponibles <= 0) {
      throw new BadRequestException(`No hay sesiones disponibles en el bono`);
    }

    // Descontar una sesión del bono
    bono.sesionesDisponibles -= 1;
    await this.bonosRepository.save(bono); // Guardar el bono actualizado

    // Buscar el paciente asociado (aquí asignamos paciente_fk)
    const paciente = await this.pacientesRepository.findOne({ where: { paciente_id: paciente_fk } });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${paciente_fk} no encontrado`);
    }

    // Crear y guardar la sesión, incluyendo paciente_fk
    const sesion = this.sesionesRepository.create({ ...sesionData, evaluacion, bono, paciente });
    return this.sesionesRepository.save(sesion);
  }

  async findAll(): Promise<Sesion[]> {
    return this.sesionesRepository.find({ relations: ['paciente', 'bono'] });
  }

  async findOne(id: number): Promise<Sesion> {
    const sesion = await this.sesionesRepository.findOne({ where: { sesion_id: id }, relations: ['evaluacion', 'paciente', 'bono'] });
    if (!sesion) throw new NotFoundException(`Sesión con ID ${id} no encontrada`);
    return sesion;
  }

  async findById(id: number): Promise<Sesion> {
    return this.sesionesRepository.findOne({
      where: { sesion_id: id },
      relations: ['evaluacion', 'paciente', 'bono'], // Cargar relaciones necesarias
    });
  }

  async getSesionesWithBonoByPaciente(pacienteId: number): Promise<any[]> {
    const sesiones = await this.sesionesRepository.find({
      where: { paciente: { paciente_id: pacienteId } },
      relations: ['bono'],
    });

    return sesiones.map(sesion => ({
      ...sesion,
      folio: sesion.bono?.folio || null, // Añadir el número de folio del bono
    }));
  }

  async getLastSesion(pacienteId: number): Promise<Sesion | null> {
    const sesiones = await this.sesionesRepository.find({
      where: { paciente: { paciente_id: pacienteId } },
      order: { n_de_sesion: 'DESC' },
      take: 1,
    });
    return sesiones.length ? sesiones[0] : null;
  }

  async update(id: number, updateSesionDto: UpdateSesionDto): Promise<Sesion> {
    const sesion = await this.findOne(id);
    Object.assign(sesion, updateSesionDto);
    return this.sesionesRepository.save(sesion);
  }

  async remove(id: number): Promise<void> {
    const sesion = await this.findOne(id);
    await this.sesionesRepository.remove(sesion);
  }
}


import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sesion } from './entities/sesion.entity';
import { Repository } from 'typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Bono } from 'src/bonos/entities/bono.entity';

@Injectable()
export class SesionesService {
  constructor(
    @InjectRepository(Sesion)
    private readonly sesionesRepository: Repository<Sesion>,
    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>,
    @InjectRepository(Bono)
    private readonly bonosRepository: Repository<Bono>,
  ) { }

  async create(sesionData: CreateSesionDto): Promise<Sesion> {
    const { paciente_fk, bono_fk, ...rest } = sesionData;

    const paciente = await this.pacientesRepository.findOne({ where: { paciente_id: paciente_fk } });
    if (!paciente) throw new NotFoundException(`Paciente con ID ${paciente_fk} no encontrado`);

    const bono = await this.bonosRepository.findOne({ where: { bono_id: bono_fk } });
    if (!bono) throw new NotFoundException(`Bono con ID ${bono_fk} no encontrado`);

    const nuevaSesion = this.sesionesRepository.create({
      ...rest,
      paciente,
      bono,
    });

    return this.sesionesRepository.save(nuevaSesion);
  }

  async findAll(): Promise<Sesion[]> {
    return this.sesionesRepository.find({ relations: ['paciente', 'bono'] });
  }

  async findOne(id: number): Promise<Sesion> {
    const sesion = await this.sesionesRepository.findOne({ where: { sesion_id: id }, relations: ['paciente', 'bono'] });
    if (!sesion) throw new NotFoundException(`Sesión con ID ${id} no encontrada`);
    return sesion;
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


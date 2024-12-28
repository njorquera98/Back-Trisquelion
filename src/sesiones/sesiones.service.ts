import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sesion } from './entities/sesion.entity';
import { Repository } from 'typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Injectable()
export class SesionesService {
  constructor(
    @InjectRepository(Sesion)
    private readonly sesionesRepository: Repository<Sesion>,

    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>,
  ) { }

  async create(pacienteId: number, sesionData: Partial<Sesion>): Promise<Sesion> {
    // Verificar que el paciente existe
    const paciente = await this.pacientesRepository.findOneBy({ paciente_id: pacienteId });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${pacienteId} no encontrado`);
    }

    // Obtener el último número de sesión del paciente
    const lastSesion = await this.sesionesRepository.findOne({
      where: { paciente: { paciente_id: pacienteId } },
      order: { n_de_sesion: 'DESC' }, // Ordenar por número de sesión descendente
    });

    // Calcular el siguiente número de sesión
    const nextNSesion = lastSesion ? lastSesion.n_de_sesion + 1 : 1;

    // Crear la nueva sesión
    const nuevaSesion = this.sesionesRepository.create({
      ...sesionData,
      n_de_sesion: nextNSesion,
      paciente,
    });

    // Guardar y devolver la nueva sesión
    return this.sesionesRepository.save(nuevaSesion);
  }

  findAll() {
    return //this.sesionesRepository.find();
  }

  findOne(sesion_id: number) {
    return this.sesionesRepository.findOneBy({ sesion_id });
  }

  async findByPacienteId(pacienteId: number): Promise<Sesion[]> {
    const paciente = await this.pacientesRepository.findOneBy({ paciente_id: pacienteId });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${pacienteId} no encontrado`);
    }

    return this.sesionesRepository.find({
      where: { paciente: { paciente_id: pacienteId } },
      relations: ['paciente'], // Opcional: para incluir los detalles del paciente si es necesario
    });
  }

  update(sesion_id: number, updateSesionDto: UpdateSesionDto) {
    return this.sesionesRepository.update(sesion_id, updateSesionDto);
  }

  remove(id: number) {
    return `This action removes a #${id} sesione`;
  }
}


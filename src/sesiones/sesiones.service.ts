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
    const paciente = await this.pacientesRepository.findOneBy({ paciente_id: pacienteId });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${pacienteId} no encontrado`);
    }

    const nuevaSesion = this.sesionesRepository.create({
      ...sesionData,
      paciente,
    });
    return this.sesionesRepository.save(nuevaSesion);
  }

  findAll() {
    return //this.sesionesRepository.find();
  }

  findOne(sesion_id: number) {
    return this.sesionesRepository.findOneBy({ sesion_id });
  }

  update(sesion_id: number, updateSesionDto: UpdateSesionDto) {
    return this.sesionesRepository.update(sesion_id, updateSesionDto);
  }

  remove(id: number) {
    return `This action removes a #${id} sesione`;
  }
}


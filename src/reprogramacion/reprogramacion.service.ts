import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReprogramacionSesion } from './entities/reprogramacion.entity';
import { CreateReprogramacionDto } from './dto/create-reprogramacion.dto';
import { UpdateReprogramacionDto } from './dto/update-reprogramacion.dto';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Injectable()
export class ReprogramacionService {
  constructor(
    @InjectRepository(ReprogramacionSesion)
    private reprogramacionRepository: Repository<ReprogramacionSesion>,

    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) { }


  async create(createReprogramacionDto: CreateReprogramacionDto) {
    const paciente = await this.pacienteRepository.findOne({
      where: { paciente_id: createReprogramacionDto.paciente_fk },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const reprogramacion = this.reprogramacionRepository.create({
      ...createReprogramacionDto,
      paciente, // aquí se asigna la entidad completa
    });

    return this.reprogramacionRepository.save(reprogramacion);
  }

  findAll() {
    return this.reprogramacionRepository.find({ relations: ['paciente'] });
  }

  findOne(id: number) {
    return this.reprogramacionRepository.findOne({ where: { reprogramacion_id: id }, relations: ['paciente'] });
  }

  update(id: number, dto: UpdateReprogramacionDto) {
    return this.reprogramacionRepository.update(id, dto);
  }

  remove(id: number) {
    return this.reprogramacionRepository.delete(id);
  }

  async limpiarReprogramacionesPasadas() {
    const hoy = new Date();
    await this.reprogramacionRepository
      .createQueryBuilder()
      .update()
      .set({ estado: false })
      .where('fecha_nueva < :hoy', { hoy: hoy.toISOString().split('T')[0] })
      .andWhere('estado = true')
      .execute();
  }
}


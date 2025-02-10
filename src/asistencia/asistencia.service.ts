import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Asistencia } from './entities/asistencia.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Horario } from 'src/horario/entities/horario.entity';

@Injectable()
export class AsistenciaService {

  constructor(
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
    @InjectRepository(Asistencia)
    private asistenciaRepository: Repository<Asistencia>,
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) { }

  async create(createAsistenciaDto: CreateAsistenciaDto): Promise<Asistencia> {
    const paciente = await this.pacienteRepository.findOne({
      where: { paciente_id: createAsistenciaDto.paciente_id },
    });
    if (!paciente) throw new NotFoundException('Paciente no encontrado');

    const asistencia = this.asistenciaRepository.create({ ...createAsistenciaDto, paciente });
    return this.asistenciaRepository.save(asistencia);
  }

  findAll(): Promise<Asistencia[]> {
    return this.asistenciaRepository.find({ relations: ['paciente'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} asistencia`;
  }

  async update(id: number, updateAsistenciaDto: UpdateAsistenciaDto): Promise<Asistencia> {
    await this.asistenciaRepository.update(id, updateAsistenciaDto);
    const updatedAsistencia = await this.asistenciaRepository.findOne({ where: { asistencia_id: id } });
    if (!updatedAsistencia) throw new NotFoundException('Asistencia no encontrada');
    return updatedAsistencia;
  }

  remove(id: number) {
    return `This action removes a #${id} asistencia`;
  }
}

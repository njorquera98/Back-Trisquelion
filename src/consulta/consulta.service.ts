import { Injectable } from '@nestjs/common';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { Consulta } from './entities/consulta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';

@Injectable()
export class ConsultaService {
  constructor(
    @InjectRepository(Consulta)
    private consultaRepository: Repository<Consulta>,
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) { }

  // Crear una nueva consulta
  async create(createConsultaDto: CreateConsultaDto): Promise<Consulta> {
    const paciente = await this.pacienteRepository.findOne({ where: { paciente_id: createConsultaDto.paciente_fk } });
    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    const consulta = this.consultaRepository.create({
      ...createConsultaDto,
      paciente,
    });

    return await this.consultaRepository.save(consulta);
  }

  // Obtener todas las consultas
  async findAll(): Promise<Consulta[]> {
    return await this.consultaRepository.find({ relations: ['paciente'] });
  }

  // En el servicio de consulta
  async findByPaciente(pacienteId: number): Promise<Consulta[]> {
    return this.consultaRepository.find({
      where: { paciente: { paciente_id: pacienteId } },
      relations: ['paciente'],
    });
  }

  // Obtener una consulta por su ID
  async findOne(id: number): Promise<Consulta> {
    const consulta = await this.consultaRepository.findOne({
      where: { consulta_id: id },
      relations: ['paciente'],
    });

    if (!consulta) {
      throw new Error('Consulta no encontrada');
    }

    return consulta;
  }

  // Actualizar una consulta
  async update(id: number, updateConsultaDto: UpdateConsultaDto): Promise<Consulta> {
    const consulta = await this.consultaRepository.findOne({
      where: { consulta_id: id },
    });

    if (!consulta) {
      throw new Error('Consulta no encontrada');
    }

    Object.assign(consulta, updateConsultaDto);

    return await this.consultaRepository.save(consulta);
  }

  remove(id: number) {
    return `This action removes a #${id} consulta`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nota } from './entities/nota.entity';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Injectable()
export class NotaService {
  constructor(
    @InjectRepository(Nota)
    private readonly notaRepository: Repository<Nota>,

    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) { }

  async create(createNotaDto: CreateNotaDto): Promise<Nota> {
    // Buscar el paciente en la BD
    const paciente = await this.pacienteRepository.findOne({
      where: { paciente_id: createNotaDto.paciente_fk },
    });

    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    const nota = this.notaRepository.create({
      contenido: createNotaDto.contenido,
      fechaCreacion: createNotaDto.fechaCreacion,
      paciente,
    });

    return await this.notaRepository.save(nota);
  }


  async findAll(): Promise<Nota[]> {
    return await this.notaRepository.find({ relations: ['paciente'] });
  }

  async findOne(nota_id: number): Promise<Nota> {
    const nota = await this.notaRepository.findOne({
      where: { nota_id },
      relations: ['paciente'],
    });

    if (!nota) {
      throw new NotFoundException(`Nota con ID ${nota_id} no encontrada`);
    }

    return nota;
  }

  async findByPaciente(paciente_id: number): Promise<Nota[]> {
    return await this.notaRepository.find({
      where: { paciente: { paciente_id } },
      relations: ['paciente'],
    });
  }

  async update(id: number, updateNotaDto: UpdateNotaDto): Promise<Nota> {
    const nota = await this.findOne(id);
    Object.assign(nota, updateNotaDto);
    return await this.notaRepository.save(nota);
  }

  async remove(id: number): Promise<void> {
    const nota = await this.findOne(id);
    await this.notaRepository.remove(nota);
  }
}


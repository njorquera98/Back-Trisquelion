import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PesoMaximo } from './entities/peso-maximo.entity';
import { CreatePesoMaximoDto } from './dto/create-peso-maximo.dto';
import { UpdatePesoMaximoDto } from './dto/update-peso-maximo.dto';
import { Paciente } from 'src/pacientes/entities/paciente.entity';


@Injectable()
export class PesoMaximoService {
  constructor(
    @InjectRepository(PesoMaximo)
    private readonly pesoMaximoRepository: Repository<PesoMaximo>,

    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>
  ) { }


  async create(createPesoMaximoDto: CreatePesoMaximoDto): Promise<PesoMaximo> {
    const paciente = await this.pacienteRepository.findOne({
      where: { paciente_id: createPesoMaximoDto.paciente_fk }, // Buscamos por ID
    });

    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    const pesoMaximo = this.pesoMaximoRepository.create({
      ...createPesoMaximoDto,
      paciente: paciente, // Asignamos la entidad paciente
    });

    return await this.pesoMaximoRepository.save(pesoMaximo);
  }

  async findAll(): Promise<PesoMaximo[]> {
    return await this.pesoMaximoRepository.find({ relations: ['paciente'] });
  }

  async findOne(peso_id: number): Promise<PesoMaximo> {
    const pesoMaximo = await this.pesoMaximoRepository.findOne({
      where: { peso_id },
      relations: ['paciente'],
    });

    if (!pesoMaximo) {
      throw new NotFoundException(`Peso máximo con ID ${peso_id} no encontrado`);
    }

    return pesoMaximo;
  }

  async findByPaciente(paciente_id: number): Promise<PesoMaximo[]> {
    return await this.pesoMaximoRepository.find({
      where: { paciente: { paciente_id } },
      relations: ['paciente'],
    });
  }

  async update(id: number, updatePesoMaximoDto: UpdatePesoMaximoDto): Promise<PesoMaximo> {
    const pesoMaximo = await this.findOne(id);
    Object.assign(pesoMaximo, updatePesoMaximoDto);
    return await this.pesoMaximoRepository.save(pesoMaximo);
  }

  async remove(id: number): Promise<void> {
    const pesoMaximo = await this.findOne(id);
    await this.pesoMaximoRepository.remove(pesoMaximo);
  }
}


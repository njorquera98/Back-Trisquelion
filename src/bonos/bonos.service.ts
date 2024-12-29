import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bono } from './entities/bono.entity';
import { CreateBonoDto } from './dto/create-bono.dto';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Injectable()
export class BonosService {
  constructor(
    @InjectRepository(Bono)
    private readonly bonoRepository: Repository<Bono>,
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) { }

  async create(createBonoDto: CreateBonoDto): Promise<Bono> {
    const { paciente_fk, ...bonoData } = createBonoDto;

    // Verificar que el paciente existe
    const paciente = await this.pacienteRepository.findOne({
      where: { paciente_id: paciente_fk },
    });

    if (!paciente) {
      throw new Error(`Paciente con id ${paciente_fk} no encontrado`);
    }

    // Crear el bono y asociarlo al paciente
    const bono = this.bonoRepository.create({ ...bonoData, paciente });
    return this.bonoRepository.save(bono);
  }

  async findAll(): Promise<Bono[]> {
    return this.bonoRepository.find({ relations: ['paciente'] });
  }

  async findOne(id: number): Promise<Bono | null> {
    return this.bonoRepository.findOne({ where: { bono_id: id } });
  }

  async findByPaciente(pacienteId: number): Promise<Bono[]> {
    return this.bonoRepository.find({
      where: { paciente: { paciente_id: pacienteId } },
      relations: ['paciente'],
    });
  }

  async update(bonoId: number, updateBonoDto: Partial<CreateBonoDto>): Promise<Bono> {
    const bono = await this.bonoRepository.findOne({
      where: { bono_id: bonoId },
      relations: ['paciente'],
    });

    if (!bono) {
      throw new Error(`Bono con id ${bonoId} no encontrado`);
    }

    // Actualizar los campos que vienen en el DTO
    Object.assign(bono, updateBonoDto);

    return this.bonoRepository.save(bono);
  }

  async remove(bonoId: number): Promise<string> {
    const bono = await this.bonoRepository.findOne({ where: { bono_id: bonoId } });

    if (!bono) {
      throw new Error(`Bono con id ${bonoId} no encontrado`);
    }

    await this.bonoRepository.remove(bono);
    return `Bono con id ${bonoId} eliminado correctamente`;
  }
}


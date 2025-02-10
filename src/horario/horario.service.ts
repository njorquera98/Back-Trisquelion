import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Repository } from 'typeorm';
import { Horario } from './entities/horario.entity';

@Injectable()
export class HorarioService {

  constructor(
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) { }

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    const paciente = await this.pacienteRepository.findOne({
      where: { paciente_id: createHorarioDto.paciente_fk },
    });
    if (!paciente) throw new NotFoundException('Paciente no encontrado');

    const horario = this.horarioRepository.create({ ...createHorarioDto, paciente });
    return this.horarioRepository.save(horario);
  }

  findAll(): Promise<Horario[]> {
    return this.horarioRepository.find({ relations: ['paciente'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} horario`;
  }

  async obtenerHorariosDeHoy(): Promise<any> {
    const fechaHoy = new Date();
    const diaDeLaSemana = fechaHoy.getDay(); // 0 = Domingo, 1 = Lunes, etc.

    const diaNombre = this.diaDeLaSemanaToString(diaDeLaSemana);  // Convertir a nombre de día

    // Filtra los horarios en función del nombre del día y que el paciente esté activo
    const horariosHoy = await this.horarioRepository.find({
      where: {
        dia_semana: diaNombre,  // Filtrar por día de la semana
        paciente: {
          activo: true  // Filtrar pacientes activos
        }
      },
      relations: ['paciente'], // Asegúrate de cargar las relaciones necesarias
    });

    return horariosHoy;  // Aquí agregamos los horarios para hoy
  }


  private diaDeLaSemanaToString(dia: number): string {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[dia];
  }


  async obtenerHorariosPorPaciente(pacienteId: number): Promise<Horario[]> {
    return this.horarioRepository.find({
      where: { paciente: { paciente_id: pacienteId } }, // Buscar dentro del objeto paciente
      relations: ['paciente'], // Asegura que la relación se cargue
    });
  }


  async update(id: number, updateHorarioDto: UpdateHorarioDto): Promise<Horario> {
    await this.horarioRepository.update(id, updateHorarioDto);
    const updatedHorario = await this.horarioRepository.findOne({ where: { horario_id: id } });
    if (!updatedHorario) throw new NotFoundException('Horario no encontrado');
    return updatedHorario;
  }
  remove(id: number) {
    return `This action removes a #${id} horario`;
  }
}

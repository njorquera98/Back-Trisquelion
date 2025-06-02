import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Repository } from 'typeorm';
import { Horario } from './entities/horario.entity';
import { Not, IsNull } from 'typeorm';
import { log } from 'node:console';

@Injectable()
export class HorarioService {

  constructor(
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) { }

  // Crear un horario
  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    const paciente = await this.pacienteRepository.findOne({
      where: { paciente_id: createHorarioDto.paciente_fk },
    });
    if (!paciente) throw new NotFoundException('Paciente no encontrado');

    const horario = this.horarioRepository.create({ ...createHorarioDto, paciente });
    return this.horarioRepository.save(horario);
  }

  // Obtener todos los horarios
  findAll(): Promise<Horario[]> {
    return this.horarioRepository.find({ relations: ['paciente'] });
  }

  // Obtener un horario por ID (función de ejemplo)
  findOne(id: number) {
    return this.horarioRepository.findOne({ where: { horario_id: id }, relations: ['paciente'] });
  }

  // Obtener horarios por fecha
  async obtenerHorariosSemanales(): Promise<Record<string, any[]>> {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const resultado: Record<string, any[]> = {};

    for (const dia of diasSemana) {
      const horarios = await this.horarioRepository.find({
        where: {
          dia_semana: dia,
          hora: Not(IsNull()),
          paciente: {
            activo: true,
          },
        },
        relations: ['paciente'],
        order: {
          hora: 'ASC', // ordenamos por hora
        },
      });

      resultado[dia] = horarios.map(h => ({
        nombre: `${h.paciente.nombre} ${h.paciente.apellido}`,
        hora: h.hora,
      }));
    }

    return resultado;
  }

  // Obtener horarios por paciente
  async obtenerHorariosPorPaciente(pacienteId: number): Promise<Horario[]> {
    return this.horarioRepository.find({
      where: { paciente: { paciente_id: pacienteId } }, // Buscar dentro del objeto paciente
      relations: ['paciente'], // Asegura que la relación se cargue
    });
  }

  async obtenerHorariosDeHoy(): Promise<Horario[]> {
    const fechaHoy = new Date();
    const diaSemana = fechaHoy.getDay(); // Obtiene el día de la semana (0-6)
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaNombre = diasSemana[diaSemana];

    console.log(fechaHoy);
    return this.horarioRepository.find({
      where: {
        dia_semana: diaNombre,
        paciente: {
          activo: true,
        },
        hora: Not(IsNull()),
      },
      relations: ['paciente'],
    });
  }


  // Actualizar un horario
  async update(id: number, updateHorarioDto: UpdateHorarioDto): Promise<Horario> {
    const horario = await this.horarioRepository.findOne({ where: { horario_id: id } });

    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }

    // Actualizar solo los campos que han sido modificados
    if (updateHorarioDto.hora !== undefined) {
      horario.hora = updateHorarioDto.hora;
    }

    await this.horarioRepository.save(horario);

    return horario;
  }

  // Eliminar un horario
  async remove(id: number): Promise<void> {
    const horario = await this.horarioRepository.findOne({ where: { horario_id: id } });

    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }

    await this.horarioRepository.remove(horario);
  }
}


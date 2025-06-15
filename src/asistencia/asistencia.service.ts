import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { Repository, Between } from 'typeorm';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { parseISO, getDay, startOfWeek, addDays, format } from 'date-fns';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepo: Repository<Asistencia>,

    @InjectRepository(Paciente)
    private pacienteRepo: Repository<Paciente>,
  ) { }

  async create(createDto: CreateAsistenciaDto): Promise<Asistencia> {
    const paciente = await this.pacienteRepo.findOneBy({ paciente_id: createDto.paciente_fk });
    const asistencia = this.asistenciaRepo.create({ ...createDto, paciente });
    return this.asistenciaRepo.save(asistencia);
  }

  async update(id: number, updateDto: UpdateAsistenciaDto): Promise<Asistencia> {
    await this.asistenciaRepo.update(id, updateDto);
    return this.asistenciaRepo.findOneBy({ asistencia_id: id });
  }

  // asistencia.service.ts
  async obtenerAsistenciasConPaciente(inicio: string, fin: string): Promise<Asistencia[]> {
    return this.asistenciaRepo.find({
      where: {
        fecha: Between(inicio, fin),
      },
      relations: ['paciente'], // <-- Esto hace el JOIN
      order: { fecha: 'ASC', hora_programada: 'ASC' },
    });
  }

  async generarAsistenciasSemanaDesde(inicio: string) {
    // Parsear fecha de inicio
    const fecha = parseISO(inicio);

    // Validar que no sea domingo
    if (getDay(fecha) === 0) {
      throw new BadRequestException('La fecha de inicio no puede ser un domingo.');
    }

    // Ajustar fecha al lunes de esa semana
    const fechaInicio = startOfWeek(fecha, { weekStartsOn: 1 });

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Obtener pacientes activos con sus horarios
    const pacientesActivos = await this.pacienteRepo.find({
      where: { activo: true },
      relations: ['horarios'],
    });

    const registros: Asistencia[] = [];

    for (const paciente of pacientesActivos) {
      for (const horario of paciente.horarios) {
        const { dia_semana, hora } = horario;

        if (!hora) continue; // Ignorar si no hay hora asignada

        const diaIndex = diasSemana.indexOf(dia_semana);
        if (diaIndex === -1) continue; // Ignorar días no válidos

        const fechaAsistencia = addDays(fechaInicio, diaIndex);
        const fechaFormateada = format(fechaAsistencia, 'yyyy-MM-dd');

        // Verificar si ya existe la asistencia para ese paciente, fecha y hora
        const yaExiste = await this.asistenciaRepo.findOne({
          where: {
            paciente: { paciente_id: paciente.paciente_id },
            fecha: fechaFormateada,
            hora_programada: hora,
          },
        });

        if (!yaExiste) {
          const nuevaAsistencia = this.asistenciaRepo.create({
            fecha: fechaFormateada,
            hora_programada: hora,
            estado: null,
            paciente,
          });
          registros.push(nuevaAsistencia);
        }
      }
    }

    const guardados = await this.asistenciaRepo.save(registros);

    return {
      semanaDesde: format(fechaInicio, 'yyyy-MM-dd'),
      semanaHasta: format(addDays(fechaInicio, 5), 'yyyy-MM-dd'),
      totalGenerados: guardados.length,
      detalles: guardados.map((a) => ({
        paciente: a.paciente.paciente_id,
        fecha: a.fecha,
        hora: a.hora_programada,
      })),
    };
  }
}


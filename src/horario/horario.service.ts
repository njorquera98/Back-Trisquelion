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
  async obtenerHorariosPorFecha(fechaStr: string): Promise<Horario[]> {
    if (!fechaStr) {
      throw new Error('La fecha es obligatoria.');
    }

    // Validar formato de fecha (dd-mm-yyyy)
    const fechaRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!fechaRegex.test(fechaStr)) {
      throw new Error('El formato de fecha es inválido. Debe ser dd-mm-yyyy.');
    }

    console.log(`Fecha recibida: ${fechaStr}`);

    // Convertir la fecha de string a objeto Date
    const [dia, mes, anio] = fechaStr.split('-').map(Number); // Ajustamos el orden de los valores
    console.log(`Día: ${dia}, Mes: ${mes}, Año: ${anio}`);

    // Crear la fecha (el mes en JavaScript empieza desde 0)
    const fecha = new Date(anio, mes - 1, dia);
    console.log(`Fecha calculada (sin UTC): ${fecha}`);

    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
      throw new Error('La fecha calculada es inválida.');
    }

    // Obtener el nombre del día de la semana
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaNombre = diasSemana[fecha.getDay()];
    console.log(`Día calculado: ${diaNombre} (Valor de getDay: ${fecha.getDay()})`);

    // Buscar los horarios que coincidan con el día de la semana
    const horarios = await this.horarioRepository.find({
      where: {
        dia_semana: diaNombre,
        paciente: {
          activo: true, // Solo pacientes activos
        },
        hora: Not(IsNull()), // Asegura que la hora no sea null
      },
      relations: ['paciente'],
    });

    console.log(`Horarios encontrados:`, horarios);

    return horarios;
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


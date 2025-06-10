import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoAsistencia } from '../entities/asistencia.entity';

export class CreateAsistenciaDto {
  @IsDateString()
  fecha: string;

  @IsString()
  hora_programada: string;

  @IsOptional()
  @IsEnum(EstadoAsistencia)
  estado?: EstadoAsistencia;

  @IsOptional()
  paciente_fk: number; // solo si se quiere usar directamente
}


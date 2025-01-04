import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteDto } from './create-paciente.dto';
import { IsBoolean, IsDate, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {
  @IsString()
  @IsOptional()
  @MinLength(1)
  nombre?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  apellido?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  telefono?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  rut?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  correo?: string;

  @IsString()
  @IsOptional()
  domicilio?: string;

  @IsDate()
  @IsOptional()
  fecha_nacimiento?: Date;

  @IsString()
  @IsOptional()
  @MinLength(1)
  prevision?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

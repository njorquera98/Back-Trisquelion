import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateConsultaDto {
  @IsNumber()
  @IsNotEmpty()
  paciente_fk: number;

  @IsOptional()  // La fecha es opcional ya que se asignará automáticamente si no se pasa
  @IsDateString()
  fecha?: string;  // En formato 'YYYY-MM-DD'

  @IsOptional()  // La hora es opcional también
  @IsString()
  hora?: string;  // En formato 'HH:MM:SS'

  @IsNotEmpty()
  @IsString()
  motivo: string;

  @IsNotEmpty()
  @IsString()
  sintomas: string;

  @IsNotEmpty()
  @IsString()
  tipoConsulta: string;
}

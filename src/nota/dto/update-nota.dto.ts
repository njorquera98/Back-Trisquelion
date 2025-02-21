import { IsDateString, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateNotaDto {
  @IsOptional()
  @IsString()
  contenido?: string;

  @IsOptional()
  @IsDateString()
  fechaCreacion?: string; // 🔹 Cambiado de fechaIngreso a fechaCreacion

  @IsOptional()
  @IsNumber()
  paciente_fk?: number;
}


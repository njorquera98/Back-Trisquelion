import { IsNotEmpty, IsBoolean, IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateAntecedenteDto {
  @IsNotEmpty()
  @IsString()
  tipo: string; // Cardiovascular, Pulmonar, etc.

  @IsOptional()
  @IsString()
  descripcion?: string; // Puede ser opcional

  @IsNotEmpty()
  @IsBoolean()
  tieneAntecedente: boolean; // Si tiene o no el antecedente

  @IsOptional()
  @IsDateString()
  fechaRegistro?: string; // Fecha de registro del antecedente

  @IsNumber()
  paciente_fk: number;
}


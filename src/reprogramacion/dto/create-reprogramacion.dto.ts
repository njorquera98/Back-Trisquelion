import { IsDateString, IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateReprogramacionDto {
  @IsNumber()
  paciente_fk: number;

  @IsDateString()
  fecha_original: string;

  @IsDateString()
  fecha_nueva: string;

  @IsString()
  hora_nueva: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}


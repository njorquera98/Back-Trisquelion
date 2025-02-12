import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateHorarioDto {
  @IsNotEmpty()
  @IsString()
  dia_semana: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  hora: string | null;

  @IsNotEmpty()
  @IsNumber()
  paciente_fk: number;
}


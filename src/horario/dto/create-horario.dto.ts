import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateHorarioDto {
  @IsNotEmpty()
  @IsString()
  dia_semana: string;

  @IsNotEmpty()
  @IsString()
  hora: string;

  @IsNotEmpty()
  @IsNumber()
  paciente_fk: number;
}


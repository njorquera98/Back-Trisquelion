import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateEvaluacionDto {
  @IsString()
  @IsNotEmpty()
  objetivo: string;

  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @IsString()
  @IsNotEmpty()
  anamnesis: string;

  @IsDateString()
  @IsNotEmpty()
  fechaIngreso: string;

  @IsNotEmpty()
  paciente_fk: number;
}


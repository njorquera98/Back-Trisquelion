import { IsString, IsDateString } from 'class-validator';

export class CreateEvaluacionDto {
  @IsString()
  objetivo: string;

  @IsString()
  diagnostico: string;

  @IsString()
  anamnesis: string;

  @IsDateString()
  fechaIngreso: string;

  paciente_fk: number;
}


import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluacionDto } from './create-evaluacion.dto';
import { IsDateString, IsString } from 'class-validator';

export class UpdateEvaluacionDto extends PartialType(CreateEvaluacionDto) {
  @IsString()
  objetivo: string;

  @IsString()
  diagnostico: string;

  @IsString()
  anamnesis: string;

  @IsDateString()
  fechaIngreso: string;
}

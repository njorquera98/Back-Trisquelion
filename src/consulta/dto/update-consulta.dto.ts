import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultaDto } from './create-consulta.dto';

export class UpdateConsultaDto extends PartialType(CreateConsultaDto) {
  @IsOptional()
  @IsString()
  fecha?: string;

  @IsOptional()
  @IsString()
  hora?: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  sintomas?: string;

  @IsOptional()
  @IsString()
  tipoConsulta?: string;

  @IsOptional()
  @IsString()
  diagnostico?: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateSesionDto } from './create-sesion.dto';
import { IsDate, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSesionDto extends PartialType(CreateSesionDto) {

  @IsDate()
  @IsOptional()
  @MinLength(1)
  fecha?: Date;

  @IsDate()
  @IsOptional()
  @MinLength(1)
  hora?: Date;

  @IsString()
  @IsOptional()
  @MinLength(1)
  descripcion?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  tipo_sesion?: string;
}

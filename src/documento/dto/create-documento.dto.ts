import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateDocumentoDto {
  @IsNotEmpty()
  @IsString()
  folio: string;

  @IsNotEmpty()
  @IsString()
  codigo_validacion: string;

  @IsOptional()
  fecha_creacion?: string;

  @IsNotEmpty()
  @IsNumber()
  consulta_fk: number;
}


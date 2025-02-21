import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotaDto {
  @IsNotEmpty()
  @IsString()
  contenido: string;

  @IsDateString()
  @IsNotEmpty()
  fechaCreacion: string;

  @IsNotEmpty()
  @IsNumber()
  paciente_fk: number;
}


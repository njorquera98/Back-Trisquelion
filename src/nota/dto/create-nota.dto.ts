import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotaDto {

  @IsNotEmpty()
  @IsString()
  contenido: string;

  @IsNotEmpty()
  @IsNumber()
  pacienteId: number;
}


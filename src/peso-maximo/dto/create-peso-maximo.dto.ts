import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePesoMaximoDto {
  @IsNotEmpty()
  @IsString()
  ejercicio: string;

  @IsNotEmpty()
  @IsNumber()
  peso: number;

  @IsOptional()
  @IsString()
  fechaRegistro?: string;

  @IsNotEmpty()
  @IsNumber()
  pacienteId: number;
}


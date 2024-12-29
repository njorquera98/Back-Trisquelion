import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreatePacienteDto {

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  telefono: string;

  @IsString()
  @IsOptional()
  correo: string;

  @IsString()
  @IsOptional()
  domicilio: string;

  @IsDateString()
  fecha_nacimiento: Date;

  @IsString()
  prevision: string;
}

import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreatePacienteDto {

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  telefono: string;

  @IsString()
  correo: string;

  @IsString()
  domicilio: string;

  @IsDateString()
  fecha_nacimiento: Date;

  @IsString()
  prevision: string;
}

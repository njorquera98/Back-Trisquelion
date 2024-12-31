import { IsNumber, IsString, IsDate, IsNotEmpty } from 'class-validator';

export class CreateSesionDto {

  @IsNumber()
  n_de_sesion: number;

  @IsDate()
  fecha: Date;

  @IsDate()
  hora: Date;

  @IsString()
  tipo_sesion: string;

  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  bono_fk: number;

  @IsNotEmpty()
  @IsNumber()
  paciente_fk: number;

  @IsNotEmpty()
  @IsNumber()
  evaluacion_fk: number;
}


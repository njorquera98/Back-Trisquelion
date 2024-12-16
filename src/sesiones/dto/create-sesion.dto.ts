import { IsNumber, IsDate, IsString } from 'class-validator';

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
}

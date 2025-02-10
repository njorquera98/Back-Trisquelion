import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateAsistenciaDto {
  @IsNotEmpty()
  @IsNumber()
  paciente_id: number;

  @IsNotEmpty()
  @IsBoolean()
  asistencia: boolean;
}


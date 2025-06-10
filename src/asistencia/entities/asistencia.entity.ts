import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

export enum EstadoAsistencia {
  ASISTIO = 'asistio',
  NO_ASISTIO = 'no_asistio',
  REPROGRAMADA = 'reprogramada',
  SUSPENDIDA = 'suspendida',
}

@Entity()
@Index(['paciente', 'fecha', 'hora_programada'], { unique: true })
export class Asistencia {
  @PrimaryGeneratedColumn()
  asistencia_id: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora_programada: string;

  @Column({
    type: 'enum',
    enum: EstadoAsistencia,
    nullable: true,
  })
  estado: EstadoAsistencia | null;

  @ManyToOne(() => Paciente, (paciente) => paciente.asistencias)
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;
}


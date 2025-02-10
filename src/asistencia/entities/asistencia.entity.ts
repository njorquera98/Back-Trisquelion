import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Asistencia {
  @PrimaryGeneratedColumn()
  asistencia_id: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time', nullable: true })
  hora_llegada: string | null;

  @Column({ type: 'boolean', default: false })
  asistencia: boolean;

  @ManyToOne(() => Paciente, (paciente) => paciente.asistencias)
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;
}

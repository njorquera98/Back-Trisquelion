import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Consulta {
  @PrimaryGeneratedColumn()
  consulta_id: number;

  @ManyToOne(() => Paciente, (paciente) => paciente.consultas, { nullable: false })
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha: Date;

  @Column({ type: 'time', default: () => 'CURRENT_TIME' })
  hora: Date;

  @Column({ type: 'text' })
  motivo: string;

  @Column({ type: 'text' })
  sintomas: string;

  @Column({ type: 'varchar', length: 100 })
  tipoConsulta: string;
}


import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Entity('reprogramacion_sesion')
export class ReprogramacionSesion {
  @PrimaryGeneratedColumn()
  reprogramacion_id: number;

  @Column({ type: 'date' })
  fecha_original: Date;

  @Column({ type: 'date' })
  fecha_nueva: Date;

  @Column({ type: 'varchar', length: 255 })
  hora_nueva: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  motivo: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @ManyToOne(() => Paciente, {})
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;
}


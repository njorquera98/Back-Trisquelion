import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Bono } from 'src/bonos/entities/bono.entity';
import { Sesion } from 'src/sesiones/entities/sesion.entity';

@Entity()
export class Evaluacion {
  @PrimaryGeneratedColumn()
  evaluacion_id: number;

  @Column()
  objetivo: string;

  @Column()
  diagnostico: string;

  @Column()
  anamnesis: string;

  @Column({ type: 'date' })
  fechaIngreso: string;

  @ManyToOne(() => Paciente, paciente => paciente.evaluaciones)
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;

  @ManyToOne(() => Bono, bono => bono.evaluaciones)
  @JoinColumn({ name: 'bono_fk' })
  bono: Bono;

  @OneToMany(() => Sesion, (sesion) => sesion.evaluacion)
  sesiones: Sesion[];
}


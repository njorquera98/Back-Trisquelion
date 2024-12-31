import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Bono } from 'src/bonos/entities/bono.entity';

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

  @ManyToOne(() => Bono, bono => bono.evaluaciones) // Relación de Muchos a Uno
  @JoinColumn({ name: 'bono_fk' }) // Especificamos la columna de unión
  bono: Bono; // Esta es la relación hacia el bono
}


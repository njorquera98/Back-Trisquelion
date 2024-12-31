import { Evaluacion } from 'src/evaluaciones/entities/evaluacion.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Sesion } from 'src/sesiones/entities/sesion.entity';
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Bono {
  @PrimaryGeneratedColumn()
  bono_id: number;

  @Column()
  folio: string;

  @Column()
  cantidad: number;

  @Column()
  valor: number;

  @Column()
  sesionesDisponibles: number;

  @ManyToOne(() => Paciente, paciente => paciente.bonos, { eager: true })
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;

  @OneToMany(() => Sesion, sesion => sesion.bono)
  sesiones: Sesion[]

  @OneToMany(() => Evaluacion, evaluacion => evaluacion.bono) // Relación de Uno a Muchos
  evaluaciones: Evaluacion[];
}

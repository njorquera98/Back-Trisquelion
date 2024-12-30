import { Bono } from "src/bonos/entities/bono.entity";
import { Evaluacion } from "src/evaluaciones/entities/evaluacion.entity";
import { Sesion } from "src/sesiones/entities/sesion.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Paciente {

  @PrimaryGeneratedColumn()
  paciente_id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  telefono: string;

  @Column()
  correo: string;

  @Column()
  domicilio: string;

  @Column({ type: 'date' })
  fecha_nacimiento: Date;

  @Column()
  prevision: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Sesion, sesion => sesion.paciente)
  sesiones: Sesion[];

  @OneToMany(() => Bono, bono => bono.paciente)
  bonos: Bono[];

  @OneToMany(() => Evaluacion, evaluacion => evaluacion.paciente)
  evaluaciones: Evaluacion[]
}

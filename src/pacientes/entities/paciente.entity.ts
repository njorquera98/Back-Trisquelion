import { Asistencia } from "src/asistencia/entities/asistencia.entity";
import { Bono } from "src/bonos/entities/bono.entity";
import { Evaluacion } from "src/evaluaciones/entities/evaluacion.entity";
import { Horario } from "src/horario/entities/horario.entity";
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
  rut: string;

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

  @OneToMany(() => Horario, (horario) => horario.paciente)
  horarios: Horario[];

  @OneToMany(() => Asistencia, (asistencia) => asistencia.paciente)
  asistencias: Asistencia[];
}

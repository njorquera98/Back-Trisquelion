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

  @Column({ type: 'date' })
  fecha_nacimiento: Date;

  @Column()
  prevision: string;

  @Column({ default: true })
  activo: boolean;
  /*
  //Nueva tabla?
  @Column()
  objetivo: string;

  @Column()
  diagnostico: string;

  @Column()
  anamnesis: string;

  @Column({type: 'date'})
  fecha_ingreso: Date;
  */

  @OneToMany(() => Sesion, sesion => sesion.paciente)
  sesiones: Sesion[];
}

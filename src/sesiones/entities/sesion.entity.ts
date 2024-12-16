import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Sesion {

  @PrimaryGeneratedColumn()
  sesion_id: number;

  @Column()
  n_de_sesion: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha: Date;

  @Column({ type: 'time', default: () => 'CURRENT_TIME' })
  hora: Date;

  @Column()
  tipo_sesion: string;

  @Column()
  descripcion: string;

  @ManyToOne(() => Paciente, paciente => paciente.sesiones)
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;
}

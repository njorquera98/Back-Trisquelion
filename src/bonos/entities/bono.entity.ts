import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Sesion } from "src/sesiones/entities/sesion.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Bono {
  @PrimaryGeneratedColumn()
  bono_id: number;

  @Column()
  cantidad: number;

  @Column()
  valor: number;

  @ManyToOne(() => Paciente, paciente => paciente.bonos)
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;

  @OneToMany(() => Sesion, sesion => sesion.bono)  // Relación uno a muchos
  sesiones: Sesion[];
}

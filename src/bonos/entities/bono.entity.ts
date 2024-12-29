import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Sesion } from 'src/sesiones/entities/sesion.entity';
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Bono {
  @PrimaryGeneratedColumn()
  bono_id: number;

  @Column()
  folio: number;

  @Column()
  cantidad: number;

  @Column()
  valor: number;

  @ManyToOne(() => Paciente, paciente => paciente.bonos, { eager: true })
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;

  @OneToMany(() => Sesion, sesion => sesion.bono)
  sesiones: Sesion[]
}

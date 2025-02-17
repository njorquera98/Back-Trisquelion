import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class PesoMaximo {
  @PrimaryGeneratedColumn()
  peso_id: number;

  @ManyToOne(() => Paciente, (paciente) => paciente.pesosMaximos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;

  @Column()
  ejercicio: string;

  @Column('decimal')
  peso: number;

  @Column({ type: 'date', nullable: true })
  fechaRegistro: Date;
}


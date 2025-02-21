import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Nota {
  @PrimaryGeneratedColumn()
  nota_id: number;

  @ManyToOne(() => Paciente, (paciente) => paciente.notas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;

  @Column('longtext')
  contenido: string;

  @Column({ type: 'date' })
  fechaCreacion: string;
}


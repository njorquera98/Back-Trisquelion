import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Entity()

export class Antecedente {
  @PrimaryGeneratedColumn()
  antecedente_id: number;

  @ManyToOne(() => Paciente, (paciente) => paciente.antecedentes)
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;

  @Column()
  tipo: string; // Cardiovascular, Pulmonar, Digestiva, etc.

  @Column({ nullable: true })
  descripcion: string; // Información adicional, como "Ninguna", "Sí", "Diario", etc.

  @Column({ type: 'boolean', default: false })
  tieneAntecedente: boolean; // Si el paciente tiene o no el antecedente

  @Column({ type: 'date', nullable: true })
  fechaRegistro: Date;
}

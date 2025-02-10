import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Horario {
  @PrimaryGeneratedColumn()
  horario_id: number;

  @Column()
  dia_semana: string;

  @Column({ nullable: true }) // Permite almacenar NULL si el paciente no asiste
  hora: string | null;

  @ManyToOne(() => Paciente, (paciente) => paciente.horarios)
  @JoinColumn({ name: 'paciente_fk' })
  paciente: Paciente;
}


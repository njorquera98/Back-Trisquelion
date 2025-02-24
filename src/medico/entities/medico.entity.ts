import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Consulta } from 'src/consulta/entities/consulta.entity';

@Entity()
export class Medico {
  @PrimaryGeneratedColumn()
  medico_id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  especialidad: string;

  @Column()
  rut: string;

  @Column()
  reg_sis: string;

  @Column()
  firma: string;

  @OneToMany(() => Consulta, (consulta) => consulta.medico)  // Cambiar 'medico' por 'medico_fk' en la propiedad de la relación
  consultas: Consulta[];
}


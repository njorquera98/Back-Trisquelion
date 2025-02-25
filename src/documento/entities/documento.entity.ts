import { Consulta } from 'src/consulta/entities/consulta.entity';
import { Firma } from 'src/firma/entities/firma.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class Documento {
  @PrimaryGeneratedColumn()
  documento_id: number;

  @ManyToOne(() => Consulta, (consulta) => consulta.documentos)
  @JoinColumn({ name: 'consulta_fk' })
  consulta: Consulta;

  @OneToMany(() => Firma, (firma) => firma.documento)
  firmas: Firma[];

  @Column()
  fecha_creacion: Date;

  @Column()
  folio: string;

  @Column('longtext')
  clave_validacion_publica: string;

  @Column('blob')
  pdf_firmado: Buffer;

  @Column()
  codigo_validacion: string;
}


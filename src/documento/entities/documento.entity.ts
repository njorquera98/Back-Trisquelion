import { Consulta } from 'src/consulta/entities/consulta.entity';
import { Firma } from 'src/firma/entities/firma.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Documento {
  @PrimaryGeneratedColumn()
  documento_id: number;

  @ManyToOne(() => Consulta, (consulta) => consulta.documentos)
  @JoinColumn({ name: 'consulta_fk' })
  consulta: Consulta;

  @OneToOne(() => Firma, (firma) => firma.documento, { cascade: true })
  @JoinColumn({ name: 'firma_fk' })
  firma: Firma;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @Column({ unique: true })
  folio: string;

  @Column({ unique: true })
  codigo_validacion: string;
}


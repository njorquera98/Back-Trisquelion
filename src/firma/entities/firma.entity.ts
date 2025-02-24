import { Documento } from 'src/documento/entities/documento.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Firma {
  @PrimaryGeneratedColumn()
  firma_id: number;

  @ManyToOne(() => Documento, (documento) => documento.firmas)
  @JoinColumn({ name: 'documento_fk' })
  documento: Documento;

  @Column()
  clave_publica: string;

  @Column('text')
  firma_digital: string;
}


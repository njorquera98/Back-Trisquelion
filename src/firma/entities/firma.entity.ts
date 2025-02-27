import { Exclude } from 'class-transformer';
import { Documento } from 'src/documento/entities/documento.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Firma {
  @PrimaryGeneratedColumn()
  firma_id: number;

  @OneToOne(() => Documento, (documento) => documento.firma)
  @JoinColumn({ name: 'documento_fk' })
  @Exclude()
  documento: Documento;

  @Column()
  clave_publica: string;

  @Column('text')
  firma_digital: string;
}


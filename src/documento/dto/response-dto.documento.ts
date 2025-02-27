import { Transform } from 'class-transformer';

export class DocumentoResponseDto {
  documento_id: number;
  fecha_creacion: Date;
  folio: string;
  codigo_validacion: string;
  consulta_fk: number;
  firma_fk: number;

  @Transform(({ value }) => (value ? { firma_id: value.firma_id } : null))
  firma: any;
}


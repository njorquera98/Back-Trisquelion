import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';
import { FirmaService } from 'src/firma/firma.service';
import { randomBytes } from 'crypto';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DocumentoService {
  constructor(
    @InjectRepository(Documento)
    private readonly documentoRepository: Repository<Documento>,
    private readonly firmaService: FirmaService
  ) { }

  // Crear un documento
  async crearDocumento(createDocumentoDto: CreateDocumentoDto): Promise<Documento> {
    const nuevoDocumento = new Documento();
    nuevoDocumento.consulta = { consulta_id: createDocumentoDto.consulta_fk } as any;
    nuevoDocumento.fecha_creacion = new Date();
    nuevoDocumento.folio = `FOLIO-${Date.now()}`;
    nuevoDocumento.codigo_validacion = randomBytes(8).toString('hex');

    // Guardar el documento en la BD (sin firma aún)
    const documentoGuardado = await this.documentoRepository.save(nuevoDocumento);

    // Generar y guardar la firma (esto ya la guarda en la BD)
    const firma = await this.firmaService.generarFirma(documentoGuardado);

    // Asignar la firma al documento y actualizarlo
    documentoGuardado.firma = firma;
    await this.documentoRepository.save(documentoGuardado);

    return plainToInstance(Documento, documentoGuardado);
  }

  // Obtener documento por código de validación
  async obtenerDocumento(codigo: string): Promise<Documento | undefined> {
    return this.documentoRepository.findOne({
      where: { codigo_validacion: codigo },
      relations: ['firma'], // Asegúrate de incluir la relación firma si es necesaria
    });
  }
}


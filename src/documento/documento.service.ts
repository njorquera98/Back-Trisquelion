import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';
import { FirmaService } from 'src/firma/firma.service';
import { randomBytes } from 'crypto';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { plainToInstance } from 'class-transformer';
import { log } from 'console';

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

    console.log('🟢 Documento creado:', nuevoDocumento);

    // Guardar el documento en la BD (sin firma aún)
    const documentoGuardado = await this.documentoRepository.save(nuevoDocumento);
    console.log('🟢 Documento guardado en BD:', documentoGuardado);

    // Generar y guardar la firma (esto ya la guarda en la BD)
    const firma = await this.firmaService.generarFirma(documentoGuardado);
    console.log('🟢 Firma generada:', firma);

    // Asignar la firma al documento y actualizarlo
    documentoGuardado.firma = firma;
    await this.documentoRepository.save(documentoGuardado);

    console.log('🟢 Documento actualizado con la firma:', documentoGuardado);

    return plainToInstance(Documento, documentoGuardado);
  }


  // Obtener documento por código de validación
  async obtenerDocumento(codigoValidacion: string): Promise<Documento | null> {
    console.log('🟡 Buscando documento con código:', codigoValidacion);

    // Realizamos la consulta en la base de datos con relaciones
    const documento = await this.documentoRepository.findOne({
      where: { codigo_validacion: codigoValidacion },
      relations: ['firma', 'consulta'], // Asegúrate de que las relaciones están bien definidas
    });

    console.log('🔍 Resultado de la consulta:', documento);

    // Si no encontramos el documento, retornamos null
    return documento;
  }


  // Verificar firma de un documento
  async verificarFirma(codigoValidacion: string): Promise<boolean> {
    try {
      // Obtiene el documento usando el código de validación
      const documento = await this.obtenerDocumento(codigoValidacion);
      console.log(documento);


      if (!documento) {
        throw new NotFoundException('Documento no encontrado');
      }

      if (!documento.firma) {
        throw new NotFoundException('Firma no encontrada para el documento');
      }

      console.log('🔑 Verificando firma para el documento:', documento);

      // Llama al servicio de verificación de firma
      const isValid = await this.firmaService.verificarFirma(documento.firma.firma_id.toString(), documento);

      console.log(`🔐 Resultado de la verificación de la firma: ${isValid ? 'Firma válida' : 'Firma inválida'}`);

      return isValid;
    } catch (error) {
      console.error('Error al verificar la firma:', error);
      return false;
    }
  }
}


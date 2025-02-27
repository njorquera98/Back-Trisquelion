import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Firma } from './entities/firma.entity';
import { Documento } from 'src/documento/entities/documento.entity';
import * as crypto from 'crypto';

@Injectable()
export class FirmaService {
  constructor(
    @InjectRepository(Firma)
    private readonly firmaRepo: Repository<Firma>,
  ) { }

  // Método para verificar la firma digital
  async verificarFirma(firmaId: string, documento: Documento): Promise<boolean> {
    try {
      // Busca la firma en la base de datos
      const firma = await this.firmaRepo.findOne({ where: { firma_id: parseInt(firmaId, 10) } });

      if (!firma) {
        console.log('❌ Firma no encontrada');
        return false;
      }

      console.log('🔍 Firma encontrada:', firma);

      // Verificar que la clave pública esté bien formateada
      const clavePublica = firma.clave_publica;

      // Convertir los datos del documento en JSON ordenado
      const documentoData = JSON.stringify(
        {
          folio: documento.folio,
          codigo_validacion: documento.codigo_validacion,
          fecha_creacion: documento.fecha_creacion,
          consulta_id: documento.consulta.consulta_id,
        },
        Object.keys(documento).sort()
      );

      console.log('🔹 Datos del documento para verificación:', documentoData);

      // Verificar la firma
      const isValid = crypto.verify(
        'sha256',
        Buffer.from(documentoData),
        {
          key: clavePublica,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(firma.firma_digital, 'base64')
      );

      console.log(`✅ Verificación de firma: ${isValid ? 'VÁLIDA' : 'INVÁLIDA'}`);
      return isValid;
    } catch (error) {
      console.error('❌ Error en la verificación de la firma:', error);
      return false;
    }
  }

  // Generar firma digital para un documento
  async generarFirma(documento: Documento): Promise<Firma> {
    const firma = new Firma();
    firma.documento = documento;

    // Generar par de claves (pública y privada)
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });

    // Convertir los datos del documento a JSON ordenado
    const documentoData = JSON.stringify(
      {
        folio: documento.folio,
        codigo_validacion: documento.codigo_validacion,
        fecha_creacion: documento.fecha_creacion,
        consulta_id: documento.consulta.consulta_id,
      },
      Object.keys(documento).sort() // Asegura que siempre sea el mismo orden
    );

    // Crear firma digital
    const signature = crypto.sign('sha256', Buffer.from(documentoData), privateKey).toString('base64');

    // Exportar clave pública correctamente
    const clavePublica = publicKey.export({ type: 'spki', format: 'pem' }).toString();

    // Guardar en la base de datos
    firma.clave_publica = clavePublica;  // No modificar el formato
    firma.firma_digital = signature;

    return this.firmaRepo.save(firma);
  }

}

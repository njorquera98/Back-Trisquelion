import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Firma } from './entities/firma.entity';
import { Documento } from 'src/documento/entities/documento.entity';
import * as crypto from 'crypto';
import * as elliptic from 'elliptic';

// Instancia de la curva elíptica secp256k1
const ec = new elliptic.ec('secp256k1');

@Injectable()
export class FirmaService {
  constructor(
    @InjectRepository(Firma)
    private readonly firmaRepository: Repository<Firma>,
  ) { }

  // Método para verificar la firma digital
  async verificarFirma(firmaId: string, documento: Documento): Promise<boolean> {
    try {
      // Buscar la firma en la base de datos
      const firma = await this.firmaRepository.findOne({ where: { firma_id: parseInt(firmaId, 10) } });

      if (!firma) {
        console.log('❌ Firma no encontrada');
        return false;
      }

      console.log('🔍 Firma encontrada:', firma);

      // Instancia de la curva elíptica
      const ec = new elliptic.ec('secp256k1');

      // Convertir los datos del documento a JSON ordenado
      const documentoData = JSON.stringify(
        {
          folio: documento.folio,
          codigo_validacion: documento.codigo_validacion,
          fecha_creacion: documento.fecha_creacion,
          consulta_id: documento.consulta.consulta_id,
          diagnostico: documento.consulta.diagnostico,
        },
        Object.keys(documento).sort()
      );

      console.log('🔹 Datos del documento para verificación:', documentoData);

      // Crear hash SHA-256 del documento
      const hash = crypto.createHash('sha256').update(documentoData).digest();

      // Recuperar la clave pública desde la base de datos
      const publicKey = ec.keyFromPublic(firma.clave_publica, 'hex');

      // Verificar la firma
      const isValid = publicKey.verify(hash, firma.firma_digital);

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

    // Generar un par de claves (pública y privada)
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate('hex'); // Clave privada en formato HEX
    const publicKey = keyPair.getPublic('hex'); // Clave pública en formato HEX

    // Convertir los datos del documento a JSON ordenado
    const documentoData = JSON.stringify(
      {
        folio: documento.folio,
        codigo_validacion: documento.codigo_validacion,
        fecha_creacion: documento.fecha_creacion,
        consulta_id: documento.consulta.consulta_id,
        diagnostico: documento.consulta.diagnostico,
      },
      Object.keys(documento).sort()
    );

    // Crear hash SHA-256 del documento
    const hash = crypto.createHash('sha256').update(documentoData).digest();

    // Firmar el hash con la clave privada
    const signature = keyPair.sign(hash).toDER('hex');

    // Guardar en la base de datos
    firma.clave_publica = publicKey;
    firma.firma_digital = signature;

    return this.firmaRepository.save(firma);
  }
}

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
    private readonly firmaRepo: Repository<Firma>
  ) { }

  // Generar firma digital para un documento
  async generarFirma(documento: Documento): Promise<Firma> {
    const firma = new Firma();
    firma.documento = documento;

    // Generar un par de claves (en producción, debes manejar las claves de manera segura)
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });

    const documentoData = JSON.stringify({
      folio: documento.folio,
      codigo_validacion: documento.codigo_validacion,
      fecha_creacion: documento.fecha_creacion,
      consulta_id: documento.consulta.consulta_id,
    });

    const hash = crypto.createHash('sha256').update(documentoData).digest('hex');
    const signature = crypto.sign('sha256', Buffer.from(hash), privateKey).toString('base64');

    firma.clave_publica = publicKey.export({ type: 'spki', format: 'pem' }).toString();
    firma.firma_digital = signature;

    return this.firmaRepo.save(firma);
  }

  async verificarFirma(firma: string): Promise<{ valido: boolean; documento?: Documento }> {
    const esValido = true; // Simulación de validación de firma

    if (!esValido) {
      return { valido: false };
    }

    const documento: Documento = {
      documento_id: 1,
      fecha_creacion: new Date(),
      folio: '123456',
      codigo_validacion: 'ABC123',
      consulta: { consulta_id: 10 } as any, // Simulación
      firma: { firma_id: 5 } as any, // Simulación
    };

    return { valido: true, documento };
  }
}

import * as crypto from 'crypto';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirmaService {
  // Método para generar las claves si no existen
  async generarClaves() {
    const privateKeyPath = 'keys/private_key.pem';
    const publicKeyPath = 'keys/public_key.pem';

    // Verificar si las claves ya existen
    if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
      console.log('Las claves ya existen.');
      return;
    }

    // Generar las claves públicas y privadas
    console.log('Generando nuevas claves...');
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });

    // Guardar las claves en archivos
    fs.writeFileSync(privateKeyPath, privateKey.export({ type: 'pkcs1', format: 'pem' }));
    fs.writeFileSync(publicKeyPath, publicKey.export({ type: 'spki', format: 'pem' }));

    console.log('Claves generadas y guardadas en archivos.');
  }

  // Método para firmar el documento
  async firmarDocumento(pdfBuffer: Buffer, privateKeyPem: string) {
    const sign = crypto.createSign('SHA256');
    sign.update(pdfBuffer);
    sign.end();

    const signature = sign.sign(privateKeyPem);

    return {
      pdf_firmado: pdfBuffer,  // Deberías devolver el PDF firmado, que es el mismo pdfBuffer
      firma: signature.toString('base64'),
    };
  }


  // Método para verificar la firma del documento
  async verificarFirmaDocumento(documentoId: number, pdfBuffer: Buffer) {
    const publicKeyPath = 'keys/public_key.pem';
    const publicKeyPem = fs.readFileSync(publicKeyPath, 'utf8');

    // Obtener la firma guardada en la base de datos (puedes implementarlo según tu modelo)
    const firmaGuardada = await this.obtenerFirmaGuardada(documentoId); // Implementa este método

    const verify = crypto.createVerify('SHA256');
    verify.update(pdfBuffer);
    verify.end();

    // Verificar la firma
    const esValido = verify.verify(publicKeyPem, firmaGuardada, 'base64');

    return {
      esValido,
      mensaje: esValido ? 'Firma verificada correctamente' : 'Firma no válida',
    };
  }

  // Función para obtener la firma guardada del documento (esto dependerá de tu base de datos)
  private async obtenerFirmaGuardada(documentoId: number): Promise<string> {
    // Aquí debes consultar la base de datos o el repositorio para obtener la firma guardada
    return 'firma_en_base64_obtenida_de_base_de_datos'; // Este es solo un ejemplo
  }

  async validarCodigoDocumento(codigo: string): Promise<{ esValido: boolean; mensaje: string }> {
    const documento = await this.documentoRepository.findOne({ where: { codigo_validacion: codigo } });

    if (!documento) {
      return { esValido: false, mensaje: 'Código de validación no encontrado' };
    }

    // Aquí puedes agregar lógica para verificar la firma si es necesario
    return { esValido: true, mensaje: 'El documento es válido' };
  }

}



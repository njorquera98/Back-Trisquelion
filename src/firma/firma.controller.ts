import { Controller, Post, Body } from '@nestjs/common';
import { FirmaService } from './firma.service';
import * as fs from 'fs';

@Controller('firma')
export class FirmaController {
  constructor(private readonly firmaService: FirmaService) { }

  @Post('firmar')
  async firmarDocumento(@Body() body: { documentoId: number; pdfBuffer: string }) {
    const { documentoId, pdfBuffer } = body;

    // Convertir el buffer en base64 a un buffer normal
    const pdfBufferDecoded = Buffer.from(pdfBuffer, 'base64');

    // Leer la clave privada desde el archivo
    const privateKeyPath = 'keys/private_key.pem';
    const privateKeyPem = fs.readFileSync(privateKeyPath, 'utf8');

    // Llamar al servicio de firma con el pdfBuffer y la clave privada
    return this.firmaService.firmarDocumento(pdfBufferDecoded, privateKeyPem);
  }

  @Post('verificar')
  async verificarFirmaDocumento(@Body() body: { documentoId: number; pdfBuffer: string }) {
    const { documentoId, pdfBuffer } = body;
    const pdfBufferDecoded = Buffer.from(pdfBuffer, 'base64');
    return this.firmaService.verificarFirmaDocumento(documentoId, pdfBufferDecoded);
  }
}


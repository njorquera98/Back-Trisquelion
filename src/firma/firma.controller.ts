import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { FirmaService } from './firma.service';
import { DocumentoService } from 'src/documento/documento.service';

@Controller('firma')
export class FirmaController {
  constructor(
    private readonly firmaService: FirmaService,
    private readonly documentoService: DocumentoService
  ) { }
  /*
    // Verificar la firma de un documento
    @Get('verificar/:codigo')
    async verificarFirma(@Param('codigo') codigo: string) {
      const resultado = await this.documentoService.obtenerDocumento(codigo);
  
      if (!resultado.valido || !resultado.documento) {
        throw new NotFoundException('Documento no encontrado.');
      }
  
      const esValido = await this.firmaService.verificarFirma(resultado.documento);
      return esValido
        ? { mensaje: 'La firma es válida.' }
        : { mensaje: 'La firma no es válida o el documento ha sido alterado.' };
    }
    */
}


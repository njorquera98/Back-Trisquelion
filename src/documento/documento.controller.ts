import { Controller, Get, Param, Body, Post, NotFoundException, BadRequestException, Res } from '@nestjs/common';
import { DocumentoService } from './documento.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { Response } from 'express';

@Controller('documento')
export class DocumentoController {
  constructor(
    private readonly documentoService: DocumentoService,
  ) { }

  @Post('crear/:consultaId')
  async crearDocumento(
    @Param('consultaId') consultaId: number,
    @Body() createDocumentoDto: CreateDocumentoDto
  ) {
    return this.documentoService.crearDocumento({ ...createDocumentoDto, consulta_fk: consultaId });
  }

  @Get('validar/:codigo')
  async validarDocumento(@Param('codigo') codigo: string): Promise<{ exito: boolean }> {
    console.log(`🟡 Buscando documento con código: ${codigo}`);

    // Obtener el documento
    const documento = await this.documentoService.obtenerDocumento(codigo);

    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }

    console.log('🔍 Documento encontrado:', documento);

    // Verificar la firma
    const isFirmaValida = await this.documentoService.verificarFirma(codigo);

    console.log(`🔑 Firma verificada: ${isFirmaValida ? 'Válida' : 'Inválida'}`);

    if (!isFirmaValida) {
      throw new BadRequestException('Firma no válida');
    }

    console.log(`✅ Documento validado y firma verificada con éxito`, documento);

    // Retornar un objeto con exito: true si la validación fue exitosa
    return { exito: true };
  }

  @Get('pdf/:codigo')
  async obtenerPdf(@Param('codigo') codigoValidacion: string, @Res() res: Response) {
    await this.documentoService.generarPdf(codigoValidacion, res);
  }
}

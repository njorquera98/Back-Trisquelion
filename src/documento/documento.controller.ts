import { Controller, Post, Param, Get, Res, NotFoundException } from '@nestjs/common';
import { DocumentoService } from './documento.service';
import { Response } from 'express';

@Controller('documento')
export class DocumentoController {
  constructor(private readonly documentoService: DocumentoService) { }

  // Ruta para generar el PDF
  @Post('pdf/:consultaId')
  async generarPdf(@Param('consultaId') consultaId: number) {
    return this.documentoService.crearPdf(consultaId);  // Llamamos al servicio para generar el PDF
  }

  // Ruta para descargar el PDF generado
  @Get('pdf/:id')
  async downloadPdf(@Param('id') id: number, @Res() res: Response) {
    const documento = await this.documentoService.findById(id);
    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }

    // Establecer las cabeceras para indicar que es un archivo PDF y forzar la descarga
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="documento-${id}.pdf"`,
    });
    res.send(documento.pdf_firmado);
  }
}


import { Controller, Get, Param, Body, Post, NotFoundException, BadRequestException, Res, ParseIntPipe } from '@nestjs/common';
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
    return this.documentoService.validarDocumento(codigo);
  }

  @Get('pdf/:codigo')
  async obtenerPdf(@Param('codigo') codigoValidacion: string, @Res() res: Response) {
    await this.documentoService.generarPdf(codigoValidacion, res);
  }

  @Get('paciente/:pacienteId')
  async obtenerDocumentos(@Param('pacienteId', ParseIntPipe) pacienteId: number) {
    return this.documentoService.obtenerDocumentosPorPaciente(pacienteId);
  }

  @Get('datos/:codigo')
  async obtenerDatos(@Param('codigo') codigoValidacion: string) {
    // Llamamos al servicio para obtener los datos del documento
    const documentoData = await this.documentoService.obtenerDatosPorCodigoValidacion(codigoValidacion);
    return { documento: documentoData };
  }
}

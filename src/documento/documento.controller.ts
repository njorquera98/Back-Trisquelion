import { Controller, Get, Param, Body, Post, NotFoundException, BadRequestException } from '@nestjs/common';
import { DocumentoService } from './documento.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { DocumentoResponseDto } from './dto/response-dto.documento';

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
  async validarDocumento(@Param('codigo') codigo: string): Promise<DocumentoResponseDto> {
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

    return {
      documento_id: documento.documento_id ?? null,
      fecha_creacion: documento.fecha_creacion ?? null,
      folio: documento.folio ?? null,
      codigo_validacion: documento.codigo_validacion ?? null,
      consulta_fk: documento.consulta?.consulta_id ?? null,
      firma_fk: documento.firma?.firma_id ?? null,
      firma: documento.firma, // Incluye la firma validada
    };
  }
}


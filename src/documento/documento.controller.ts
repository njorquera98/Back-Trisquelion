import { Controller, Get, Param, Body, Post, NotFoundException } from '@nestjs/common';
import { DocumentoService } from './documento.service';
import { FirmaService } from 'src/firma/firma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { DocumentoResponseDto } from './dto/response-dto.documento';

@Controller('documento')
export class DocumentoController {
  constructor(
    private readonly documentoService: DocumentoService,
    private readonly firmaService: FirmaService,
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
    const documento = await this.documentoService.obtenerDocumento(codigo);
    if (!documento) {
      throw new NotFoundException('Documento no encontrado o inválido');
    }

    const resultadoFirma = await this.firmaService.verificarFirma(documento.firma?.firma_id?.toString());

    if (!resultadoFirma || typeof resultadoFirma !== 'object') {
      throw new Error('El servicio de firma debe devolver un objeto con { valido, documento }');
    }

    const { valido, documento: doc } = resultadoFirma;

    return {
      documento_id: doc.documento_id,
      fecha_creacion: doc.fecha_creacion,
      folio: doc.folio,
      codigo_validacion: doc.codigo_validacion,
      consulta_fk: doc.consulta.consulta_id,
      firma_fk: doc.firma?.firma_id || null,
      firma: valido ? doc.firma : null,
    };
  }
}


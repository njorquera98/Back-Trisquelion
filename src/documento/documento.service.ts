import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';
import { FirmaService } from 'src/firma/firma.service';
import { randomBytes } from 'crypto';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { plainToInstance } from 'class-transformer';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import * as QRCode from 'qrcode';
import axios from 'axios';

@Injectable()
export class DocumentoService {
  constructor(
    @InjectRepository(Documento)
    private readonly documentoRepository: Repository<Documento>,
    private readonly firmaService: FirmaService
  ) { }

  // Crear un documento
  async crearDocumento(createDocumentoDto: CreateDocumentoDto): Promise<Documento> {
    const consultaId = createDocumentoDto.consulta_fk;

    // Buscar todos los documentos activos de la consulta
    const documentosExistentes = await this.documentoRepository.find({
      where: { consulta: { consulta_id: consultaId }, activo: true },
    });

    if (documentosExistentes.length > 0) {
      // Desactivar todos los documentos anteriores
      for (const doc of documentosExistentes) {
        doc.activo = false;
      }
      await this.documentoRepository.save(documentosExistentes);
      console.log('🟡 Documentos anteriores marcados como inactivos:', documentosExistentes);
    }

    // Crear nuevo documento
    const nuevoDocumento = new Documento();
    nuevoDocumento.consulta = { consulta_id: consultaId } as any;
    nuevoDocumento.fecha_creacion = new Date();
    nuevoDocumento.folio = `${Date.now()}`;
    nuevoDocumento.codigo_validacion = randomBytes(8).toString('hex');
    nuevoDocumento.activo = true; // Nuevo documento siempre activo

    console.log('🟢 Documento creado:', nuevoDocumento);

    // Guardar el documento en la BD (sin firma aún)
    const documentoGuardado = await this.documentoRepository.save(nuevoDocumento);
    console.log('🟢 Documento guardado en BD:', documentoGuardado);

    // Generar y guardar la firma (esto ya la guarda en la BD)
    const firma = await this.firmaService.generarFirma(documentoGuardado);
    console.log('🟢 Firma generada:', firma);

    // Asignar la firma al documento y actualizarlo
    documentoGuardado.firma = firma;
    await this.documentoRepository.save(documentoGuardado);

    console.log('🟢 Documento actualizado con la firma:', documentoGuardado);

    return plainToInstance(Documento, documentoGuardado);
  }

  async validarDocumento(codigoValidacion: string): Promise<{ exito: boolean }> {
    console.log(`🟡 Validando documento con código: ${codigoValidacion}`);

    // Buscar el documento activo
    const documento = await this.obtenerDocumento(codigoValidacion);
    if (!documento) {
      console.log('❌ Documento no encontrado o no activo');
      return { exito: false }; // Retorna false si no se encuentra o está inactivo
    }

    console.log('🔍 Documento activo encontrado:', documento);

    // Verificar la firma pasándole el documento
    const isFirmaValida = await this.verificarFirma(documento);
    if (!isFirmaValida) {
      throw new BadRequestException('Firma no válida');
    }

    console.log(`✅ Documento validado con éxito:`, documento);

    return { exito: true };
  }

  // Obtener documento por código de validación
  async obtenerDocumento(codigoValidacion: string): Promise<Documento | null> {
    console.log('🟡 Buscando documento activo con código:', codigoValidacion);

    // Buscar solo documentos activos con el código de validación
    const documento = await this.documentoRepository.findOne({
      where: { codigo_validacion: codigoValidacion, activo: true },
      relations: ['firma', 'consulta'],
    });

    console.log('🔍 Resultado de la consulta:', documento);

    return documento;
  }

  // Verificar firma de un documento (Recibe el documento como argumento)
  async verificarFirma(documento: Documento): Promise<boolean> {
    try {
      if (!documento.firma) {
        throw new NotFoundException('Firma no encontrada para el documento');
      }

      console.log('🔑 Verificando firma para el documento:', documento);

      // Llama al servicio de verificación de firma
      const isValid = await this.firmaService.verificarFirma(documento.firma.firma_id.toString(), documento);

      console.log(`🔐 Resultado de la verificación de la firma: ${isValid ? 'Firma válida' : 'Firma inválida'}`);

      return isValid;
    } catch (error) {
      console.error('Error al verificar la firma:', error);
      return false;
    }
  }

  async obtenerDatosPorCodigoValidacion(codigoValidacion: string) {
    const documento = await this.documentoRepository.findOne({
      where: { codigo_validacion: codigoValidacion, activo: true },
      relations: ['consulta', 'consulta.medico', 'consulta.paciente'], // Agregamos la relación con paciente
    });

    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }

    const consulta = documento.consulta;
    const paciente = consulta.paciente;

    return {
      documento: {
        codigo_validacion: documento.codigo_validacion,
        fecha_creacion: documento.fecha_creacion,
        folio: documento.folio,
      },
      consulta: {
        diagnostico: consulta.diagnostico,
        fecha: consulta.fecha,
      },
      medico: {
        nombre: consulta.medico?.nombre,
        apellido: consulta.medico?.apellido,
        especialidad: consulta.medico?.especialidad,
        rut: consulta.medico?.rut,
        reg_sis: consulta.medico?.reg_sis,
      },
      paciente: {
        nombre: paciente?.nombre,
        apellido: paciente?.apellido,
        rut: paciente?.rut,
        fecha_nacimiento: paciente?.fecha_nacimiento,
        domicilio: paciente?.domicilio,
      },
    };
  }

  // Función para calcular la edad correctamente considerando día, mes y año de nacimiento
  private calcularEdad(fechaNacimiento: string | Date): string {
    const fechaNac = fechaNacimiento instanceof Date ? fechaNacimiento : new Date(fechaNacimiento);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNac.getMonth();
    const diaDiferencia = hoy.getDate() - fechaNac.getDate();

    // Restar un año si aún no ha pasado el cumpleaños este año
    if (mesDiferencia < 0 || (mesDiferencia === 0 && diaDiferencia < 0)) {
      edad--;
    }

    return `${edad} años`;
  }

  // Función para descargar la imagen desde una URL
  private async descargarImagen(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error('Error descargando la imagen:', error);
      throw new InternalServerErrorException('Error descargando la imagen desde la URL');
    }
  }

  // Función para generar el PDF y devolverlo como archivo
  async generarPdf(codigoValidacion: string, res: Response) {
    const datosPdf = await this.obtenerDatosPorCodigoValidacion(codigoValidacion);

    if (!datosPdf) {
      throw new NotFoundException('Datos para generar el PDF no encontrados');
    }

    const doc = new PDFDocument({ size: 'A5', margins: { top: 70, left: 50, right: 50, bottom: 50 } });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="documento_${codigoValidacion}.pdf"`);
    doc.pipe(res);

    const plantillaUrl = 'https://trisquelion.cl/wp-content/uploads/2025/02/TrisquelionV1.png';

    try {
      const plantillaBuffer = await this.descargarImagen(plantillaUrl);
      doc.image(plantillaBuffer, 0, 0, { fit: [420, 596] }); // Ajusta la imagen al tamaño A5
    } catch (error) {
      console.error('Error cargando la plantilla:', error);
      throw new InternalServerErrorException('Error cargando la plantilla');
    }

    const paciente = datosPdf.paciente;
    const edad = this.calcularEdad(paciente?.fecha_nacimiento);

    //PDF
    doc.moveDown();
    doc.font('assets/fonts/OpenSans-SemiBold.ttf').fontSize(8).text(`Fecha de la consulta: ${datosPdf.consulta.fecha}`, { align: 'right' });
    doc.text(`Folio: ${datosPdf.documento.folio}`, { align: 'right' });
    doc.moveDown();

    // Información del médico
    doc.fontSize(8).text(`Médico: ${datosPdf.medico.nombre} ${datosPdf.medico.apellido}`);
    doc.text(`Especialidad: ${datosPdf.medico.especialidad}`);
    doc.text(`RUT: ${datosPdf.medico.rut}`);
    doc.text(`Registro SIS: ${datosPdf.medico.reg_sis}`);
    doc.moveDown();

    // Información del paciente
    doc.text(`Paciente: ${paciente?.nombre} ${paciente?.apellido}`);
    doc.text(`RUT: ${paciente?.rut}`);
    doc.text(`Edad: ${edad}`);
    doc.text(`Domicilio: ${paciente?.domicilio}`);
    doc.moveDown();

    doc.fontSize(10).text('ORDEN MÉDICA', {
      align: 'center',
      characterSpacing: 3,
      oblique: true
    });
    doc.moveDown();

    // Información de la consulta
    doc.fontSize(8).text(`Diagnóstico: ${datosPdf.consulta.diagnostico}`);

    // Formatear la fecha de creación en español y 24hrs
    const fechaCreacion = new Date(datosPdf.documento.fecha_creacion).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Formato 24hrs
    });

    // Fijar la información del documento en una posición específica
    doc.font('assets/fonts/OpenSans-SemiBold.ttf')
      .fontSize(7)
      .text('PARA VALIDAR ESTE DOCUMENTO INGRESE A CHECK.TRISQUELION.CL E INGRESE EL CÓDIGO (MANUAL) O ESCANEAR QR (AUTOMÁTICO)', 20, 400, {
        width: 380,  // Establece el ancho máximo para el texto, puedes ajustar este valor
        align: 'center'  // Centra el texto dentro del espacio
      });

    // Texto para el código de validación y la fecha de creación
    doc.font('assets/fonts/OpenSans-SemiBold.ttf')
      .fontSize(7)
      .text(`Código de validación: ${datosPdf.documento.codigo_validacion}`, 95, 465); // Ajusta las coordenadas Y
    doc.text(`Fecha de creación: ${fechaCreacion}`, 95, 480); // Ajusta las coordenadas Y para evitar superposición

    // URL de validación del documento
    const urlValidacion = `https://check.trisquelion.cl/documento/validar?codigo=${codigoValidacion}`;

    // Generar el código QR
    const qrImageBuffer = await QRCode.toBuffer(urlValidacion, {
      margin: 0,  // Establece el margen en 0 para eliminar los márgenes blancos
      width: 150  // Ajusta el tamaño del QR según lo necesites
    });

    // Agregar la imagen en la nueva posición
    doc.image(qrImageBuffer, 310, 440, { width: 70, height: 70 });


    // Finalizar PDF
    doc.end();
  }

  async obtenerDocumentosPorPaciente(pacienteId: number): Promise<Documento[]> {
    return this.documentoRepository.find({
      relations: ['consulta', 'consulta.paciente'],
      where: { consulta: { paciente: { paciente_id: pacienteId } }, activo: true },
      select: {
        consulta: { diagnostico: true },
        folio: true,
        fecha_creacion: true,
        codigo_validacion: true
      },
    });
  }

}


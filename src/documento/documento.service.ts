import { Injectable } from '@nestjs/common';
import { Documento } from 'src/documento/entities/documento.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PDFDocument } from 'pdf-lib';
import { ConsultaService } from 'src/consulta/consulta.service';
import { FirmaService } from 'src/firma/firma.service';
import * as fs from 'fs';

@Injectable()
export class DocumentoService {
  constructor(
    @InjectRepository(Documento)
    private documentoRepository: Repository<Documento>,
    private consultaService: ConsultaService,
    private readonly firmaService: FirmaService,
  ) { }

  // Función para crear un PDF
  async crearPdf(consultaId: number): Promise<Documento> {
    // Paso 1: Obtener la consulta, paciente y médico
    const consulta = await this.consultaService.findConsultaConPacienteYMedico(consultaId);
    if (!consulta) {
      throw new Error('Consulta no encontrada');
    }

    const paciente = consulta.paciente;
    const medico = consulta.medico;
    const fechaNacimiento = new Date(paciente.fecha_nacimiento);
    const edad = this.calcularEdad(fechaNacimiento);
    const fechaCreacion = new Date(); // Tomamos la fecha actual

    // Paso 2: Crear el PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 vertical

    let yPosition = 800;
    page.drawText(`Consulta Médica`, { x: 50, y: yPosition, size: 20 });
    yPosition -= 30;

    // Información del paciente
    page.drawText(`Paciente: ${paciente.nombre} ${paciente.apellido}`, { x: 50, y: yPosition, size: 15 });
    yPosition -= 20;
    page.drawText(`Edad: ${edad}`, { x: 50, y: yPosition, size: 15 });
    yPosition -= 20;
    page.drawText(`Domicilio: ${paciente.domicilio}`, { x: 50, y: yPosition, size: 15 });
    yPosition -= 30;

    // Información del médico
    page.drawText(`Médico: ${medico.nombre} ${medico.apellido}`, { x: 50, y: yPosition, size: 15 });
    yPosition -= 20;
    page.drawText(`Especialidad: ${medico.especialidad}`, { x: 50, y: yPosition, size: 15 });
    yPosition -= 20;
    page.drawText(`REG-SIS: ${medico.reg_sis}`, { x: 50, y: yPosition, size: 15 });
    yPosition -= 30;

    // Información de la consulta
    page.drawText(`Fecha: ${consulta.fecha}`, { x: 50, y: yPosition, size: 15 });
    yPosition -= 20;
    page.drawText(`Hora: ${consulta.hora}`, { x: 50, y: yPosition, size: 15 });
    yPosition -= 30;

    // Diagnóstico
    page.drawText(`Diagnóstico: ${consulta.diagnostico}`, { x: 50, y: yPosition, size: 15 });
    yPosition -= 30;

    // Agregar el folio y la fecha de creación del documento
    const folio = `FOLIO-${Date.now()}`;
    page.drawText(`Folio: ${folio}`, { x: 50, y: yPosition, size: 15 });
    yPosition -= 20;
    page.drawText(`Fecha de creación: ${fechaCreacion.toISOString().split('T')[0]}`, { x: 50, y: yPosition, size: 15 });

    // Convertir el PDF a Buffer
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer: Buffer = Buffer.from(pdfBytes);

    // Paso 3: Generar claves de firma (si no existen)
    const privateKeyPath = 'keys/private_key.pem';
    const publicKeyPath = 'keys/public_key.pem';

    if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
      await this.firmaService.generarClaves(); // Asegurar que las claves existan
    }

    const privateKeyPem = fs.readFileSync(privateKeyPath, 'utf8');
    const publicKeyPem = fs.readFileSync(publicKeyPath, 'utf8');

    // Paso 4: Crear el documento en la base de datos
    let documento = new Documento();
    documento.consulta = consulta;
    documento.folio = folio; // Asignamos el folio
    documento.clave_validacion_publica = publicKeyPem; // Asignamos la clave pública
    documento.fecha_creacion = fechaCreacion; // Guardamos la fecha de creación en la base de datos

    // Guardamos el documento
    documento = await this.documentoRepository.save(documento);
    console.log('Documento guardado con ID:', documento.documento_id);

    // Paso 5: Firmar el documento
    const documentoFirmado = await this.firmaService.firmarDocumento(pdfBuffer, privateKeyPem);

    // Paso 6: Actualizar el documento con la firma
    documento.pdf_firmado = documentoFirmado.pdf_firmado;
    await this.documentoRepository.save(documento);

    console.log('Documento firmado y actualizado con éxito.');
    return documento;
  }

  // Función para calcular la edad en años, meses y días
  private calcularEdad(fechaNacimiento: Date): string {
    const hoy = new Date();

    let edadAnios = hoy.getFullYear() - fechaNacimiento.getFullYear();
    let edadMeses = hoy.getMonth() - fechaNacimiento.getMonth();
    let edadDias = hoy.getDate() - fechaNacimiento.getDate();

    if (edadMeses < 0 || (edadMeses === 0 && edadDias < 0)) {
      edadAnios--;
      edadMeses += 12;
    }

    if (edadDias < 0) {
      const ultimoDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
      edadDias += ultimoDiaDelMes;
    }

    return `${edadAnios} años, ${edadMeses} meses, ${edadDias} días`;
  }

  // Función para buscar el documento por ID
  async findById(id: number): Promise<Documento> {
    return this.documentoRepository.findOne({ where: { documento_id: id } });
  }
}


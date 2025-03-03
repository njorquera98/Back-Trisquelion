import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { DocumentoService } from '../documento/documento.service';

dotenv.config();

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly documentoService: DocumentoService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: parseInt(process.env.SMTP_PORT, 10) === 465, // Comparación correcta
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async enviarDocumentoPorEmail(codigoValidacion: string): Promise<void> {
    // Obtener los datos del paciente y el documento
    const datos = await this.documentoService.obtenerDatosPorCodigoValidacion(codigoValidacion);

    if (!datos) {
      throw new NotFoundException('No se encontraron datos para el documento');
    }

    const { paciente, medico, consulta, documento } = datos;
    const emailPaciente = paciente?.correo;

    if (!emailPaciente) {
      throw new NotFoundException('El paciente no tiene un correo registrado');
    }

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await this.documentoService.obtenerPdfBuffer(codigoValidacion);
    } catch (error) {
      console.error('Error al obtener el PDF:', error);
      throw new InternalServerErrorException('No se pudo generar el PDF del documento');
    }

    if (!pdfBuffer) {
      throw new InternalServerErrorException('El PDF generado está vacío');
    }

    // Crear el contenido del correo
    const asunto = `Notificación Orden Médica Electrónica`;

    const mensajeTexto = `Estimado/a ${paciente.nombre} ${paciente.apellido},

Adjunto encontrarás la orden médica correspondiente a tu consulta con ${medico.nombre}  ${medico.apellido} (${medico.especialidad}).

Te recomendamos seguir las indicaciones del documento. Si tienes alguna consulta, estamos a tu disposición.

Saludos,
Trisquelion
Avenida España #3070, Arica
Teléfonos: +569 50457094 | +569 95441752
Web: trisquelion.cl
Instagram: @trisquelion_`;

    const mensajeHTML = `
<div style="text-align: center;">
  <img style="max-width: 20%; height: auto;" src="https://trisquelion.cl/wp-content/uploads/2023/03/trisquel-removebg-preview.png" alt="Trisquelion" />
</div>
<p>Estimado/a <strong>${paciente.nombre} ${paciente.apellido}</strong>,</p>
<p>Adjunto encontrarás la orden médica correspondiente a tu consulta con <strong>${medico.nombre} ${medico.apellido}</strong> (${medico.especialidad}).</p>
<p>Te recomendamos seguir las indicaciones del documento. Si tienes alguna consulta, estamos a tu disposición.</p>
<p>Saludos,</p>
<p>&nbsp;</p>
<div style="display: flex; align-items: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">
	<div style="display: flex; align-items: center; font-family: Arial, sans-serif; font-size: 14px; color: #333;">
		<div style="margin-right: 10px;">
          <img style="max-width: 100px; height: auto;" src="https://trisquelion.cl/wp-content/uploads/2025/03/LOGO-KM.jpg" alt="Trisquelion" />
      	</div>
		<div>
			<p style="margin: 0; font-size: 16px; font-weight: bold;">Trisquelion</p>
			<p style="margin: 5px 0;">Avenida España #3070, Arica</p>
		<p style="margin: 5px 0;">Teléfonos: +569 50457094 | +569 95441752</p>
		<p style="margin: 5px 0;"><a style="color: #1a73e8;" href="https://trisquelion.cl"> <img style="max-width: 20px; vertical-align: middle; margin-right: 5px;" src="https://trisquelion.cl/wp-content/uploads/2025/03/sitio-web.png" alt="Sitio Web" />trisquelion.cl</a></p>
		<p style="margin: 5px 0;"><a style="color: #1a73e8;" href="https://instagram.com/trisquelion_"> <img style="max-width: 20px; vertical-align: middle; margin-right: 5px;" src="https://trisquelion.cl/wp-content/uploads/2025/03/logotipo-de-instagram.png" alt="Instagram" />@trisquelion_</a></p>
</div>
</div>
</div>
`;




    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.SMTP_USER,
      to: emailPaciente,
      subject: asunto,
      text: mensajeTexto,
      html: mensajeHTML,
      attachments: [
        {
          filename: `Diagnóstico-${paciente.nombre}-${paciente.apellido}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo enviado a ${emailPaciente} exitosamente`);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new InternalServerErrorException('No se pudo enviar el correo');
    }
  }
}


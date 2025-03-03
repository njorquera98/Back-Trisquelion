import { Controller, Post, Param, InternalServerErrorException } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('enviar/:codigoValidacion')
  async enviarDocumento(@Param('codigoValidacion') codigoValidacion: string) {
    try {
      await this.emailService.enviarDocumentoPorEmail(codigoValidacion);
      return { message: 'Correo enviado exitosamente' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al enviar el correo');
    }
  }
}


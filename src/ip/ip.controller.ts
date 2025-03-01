import { Controller, Post, Body } from '@nestjs/common';
import { IpService } from './ip.service'; // Servicio que maneja la lógica de la base de datos

@Controller('ip')
export class IpController {
  constructor(private readonly ipService: IpService) { }

  @Post('address')
  async postIp(@Body() body: { ip: string, fecha: string }) {
    const { ip, fecha } = body;

    // Guarda la IP en la base de datos
    await this.ipService.saveIp(ip, fecha);
    return { message: 'IP guardada correctamente' };
  }
}


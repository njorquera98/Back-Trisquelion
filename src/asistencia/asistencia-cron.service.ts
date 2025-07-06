import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AsistenciaService } from './asistencia.service';

@Injectable()
export class AsistenciaCronService {
  private readonly logger = new Logger(AsistenciaCronService.name);

  constructor(private readonly asistenciaService: AsistenciaService) { }

  // Se ejecuta cada lunes a las 2am
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generarAsistenciasAutomaticamente() {
    this.logger.log('⏰ Ejecutando cron de generación automática de asistencias...');
    try {
      const resultado = await this.asistenciaService.generarAsistenciasSemanaDesde();
      this.logger.log(`✅ Generadas ${resultado.totalGenerados} asistencias`);
    } catch (err) {
      this.logger.error('❌ Error al generar asistencias automáticamente', err);
    }
  }
}


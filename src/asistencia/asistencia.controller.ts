import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';

@Controller('asistencia')
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) { }

  @Post()
  create(@Body() dto: CreateAsistenciaDto) {
    return this.asistenciaService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateAsistenciaDto) {
    return this.asistenciaService.update(id, dto);
  }

  @Get('rango')
  getAsistenciasRango(@Query('inicio') inicio: string, @Query('fin') fin: string) {
    return this.asistenciaService.obtenerAsistenciasConPaciente(inicio, fin);
  }


  @Post('generar-semana')
  generarAsistenciasSemana(@Body('inicio') inicio: string) {
    return this.asistenciaService.generarAsistenciasSemanaDesde(inicio);
  }
}


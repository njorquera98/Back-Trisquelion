import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SesionesService } from './sesiones.service';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { Sesion } from './entities/sesion.entity';

@Controller('sesiones')
export class SesionesController {
  constructor(private readonly sesionesService: SesionesService) { }

  @Post(':pacienteId')
  async create(
    @Param('pacienteId') pacienteId: number,
    @Body() sesionData: Partial<Sesion>,
  ): Promise<Sesion> {
    // Obtener el último número de sesión del paciente
    const sesionesPaciente = await this.sesionesService.findByPacienteId(pacienteId);

    // Obtener el último número de sesión o asignar 1 si no tiene sesiones previas
    const ultimoNumeroSesion = sesionesPaciente.length > 0
      ? Math.max(...sesionesPaciente.map(s => s.n_de_sesion))
      : 0;

    // Calcular el siguiente número de sesión
    const siguienteNumeroSesion = ultimoNumeroSesion + 1;

    // Asignar el siguiente número de sesión al nuevo objeto de sesión
    const nuevaSesionData = {
      ...sesionData,
      n_de_sesion: siguienteNumeroSesion,
    };

    // Crear la sesión con el siguiente número de sesión
    return this.sesionesService.create(pacienteId, nuevaSesionData);
  }


  @Get()
  findAll() {
    return this.sesionesService.findAll();
  }

  @Get('paciente/:pacienteId')
  async findByPacienteId(@Param('pacienteId') pacienteId: number): Promise<Sesion[]> {
    return this.sesionesService.findByPacienteId(pacienteId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sesionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSesionDto: UpdateSesionDto) {
    return this.sesionesService.update(+id, updateSesionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.sesionesService.remove(+id);
  }
}

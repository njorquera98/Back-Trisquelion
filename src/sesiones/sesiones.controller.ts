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

    return this.sesionesService.create(pacienteId, sesionData);
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

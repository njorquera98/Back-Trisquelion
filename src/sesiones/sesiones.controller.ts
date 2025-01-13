import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SesionesService } from './sesiones.service';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { Sesion } from './entities/sesion.entity';

@Controller('sesiones')
export class SesionesController {
  constructor(private readonly sesionesService: SesionesService) { }

  @Post()
  async create(@Body() createSesionDto: CreateSesionDto): Promise<Sesion> {
    return this.sesionesService.create(createSesionDto);
  }

  @Get()
  async findAll(): Promise<Sesion[]> {
    return this.sesionesService.findAll();
  }

  @Get('paciente/:pacienteId')
  async getSesionesByPaciente(@Param('pacienteId') pacienteId: number): Promise<any[]> {
    return this.sesionesService.getSesionesWithBonoByPaciente(pacienteId);
  }

  @Get('last/:pacienteId')
  async getLastSesion(@Param('pacienteId') pacienteId: number): Promise<Sesion | null> {
    return this.sesionesService.getLastSesion(pacienteId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Sesion> {
    return this.sesionesService.findOne(id);
  }

  @Get('simple/:id')
  async getSesionSimple(@Param('id') id: number): Promise<any> {
    const sesion = await this.sesionesService.findById(id);

    // Transformar los datos al formato esperado
    return {
      ...sesion,
      evaluacion_fk: sesion.evaluacion?.evaluacion_id, // Extraer solo el ID
      evaluacion: undefined, // Opcional: eliminar el objeto anidado
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateSesionDto: UpdateSesionDto): Promise<Sesion> {
    return this.sesionesService.update(id, updateSesionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.sesionesService.remove(id);
  }
}


import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) { }

  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  // Obtener todos los pacientes
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  // Obtener pacientes activos
  @Get('activos')
  findActivos() {
    return this.pacientesService.findAll(true); // Filtra pacientes activos
  }

  // Obtener pacientes inactivos
  @Get('inactivos')
  findInactivos() {
    return this.pacientesService.findAll(false); // Filtra pacientes inactivos
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pacientesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(id, updatePacienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pacientesService.remove(id);
  }
}


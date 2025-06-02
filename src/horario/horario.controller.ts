import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HorarioService } from './horario.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { Horario } from './entities/horario.entity';

@Controller('horario')
export class HorarioController {
  constructor(private readonly horarioService: HorarioService) { }

  // Crear un horario
  @Post()
  create(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horarioService.create(createHorarioDto);
  }

  // Obtener horarios por fecha
  @Get('fecha')
  async obtenerHorariosPorFecha(@Param('fecha') fecha: string) {
    return await this.horarioService.obtenerHorariosSemanales();
  }

  // Obtener un horario por ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.horarioService.findOne(id);
  }

  // Obtener los horarios de un paciente
  @Get('paciente/:id')
  async getHorariosPorPaciente(@Param('id') id: number): Promise<Horario[]> {
    return this.horarioService.obtenerHorariosPorPaciente(id);
  }

  // Actualizar un horario
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateHorarioDto: UpdateHorarioDto) {
    return this.horarioService.update(id, updateHorarioDto);
  }

  // Eliminar un horario
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.horarioService.remove(id);
  }
}


import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';
import { Evaluacion } from './entities/evaluacion.entity';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';

@Controller('evaluaciones')
export class EvaluacionesController {
  constructor(private readonly evaluacionesService: EvaluacionesService) { }

  @Post()
  async create(@Body() crearEvaluacionDto: CreateEvaluacionDto): Promise<Evaluacion> {
    return this.evaluacionesService.create(crearEvaluacionDto);
  }

  @Get()
  async findAll(): Promise<Evaluacion[]> {
    return this.evaluacionesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Evaluacion> {
    const evaluacion = await this.evaluacionesService.findOne(id);
    if (!evaluacion) {
      throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
    }
    return evaluacion;
  }

  @Get('last/:id')
  async findLastByPaciente(@Param('id') id: number): Promise<Evaluacion> {
    const evaluacion = await this.evaluacionesService.findLastByPaciente(id);
    if (!evaluacion) {
      throw new NotFoundException(`No se encontró ninguna evaluación para el paciente con ID ${id}`);
    }
    return evaluacion;
  }

  @Get('paciente/:pacienteId')
  async findAllByPaciente(@Param('pacienteId') pacienteId: number): Promise<Evaluacion[]> {
    const evaluaciones = await this.evaluacionesService.findAllByPaciente(pacienteId);
    if (!evaluaciones || evaluaciones.length === 0) {
      throw new NotFoundException(`No se encontraron evaluaciones para el paciente con ID ${pacienteId}`);
    }
    return evaluaciones;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEvaluacionDto: Partial<CreateEvaluacionDto>,
  ): Promise<Evaluacion> {
    return this.evaluacionesService.update(id, updateEvaluacionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<string> {
    return this.evaluacionesService.remove(id);
  }
}


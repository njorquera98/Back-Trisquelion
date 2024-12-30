import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';
import { Evaluacion } from './entities/evaluacion.entity';

@Controller('evaluaciones')
export class EvaluacionesController {
  constructor(private readonly evaluacionesService: EvaluacionesService) { }

  @Post()
  async create(@Body() createEvaluacionDto: CreateEvaluacionDto): Promise<Evaluacion> {
    return this.evaluacionesService.create(createEvaluacionDto);
  }

  @Get()
  async findAll(): Promise<Evaluacion[]> {
    return this.evaluacionesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Evaluacion> {
    return this.evaluacionesService.findOne(id);
  }

  @Get('last/:pacienteId')
  getLastEvaluacion(@Param('pacienteId') pacienteId: number) {
    return this.evaluacionesService.getLastEvaluacionByPaciente(pacienteId);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateEvaluacionDto: UpdateEvaluacionDto): Promise<Evaluacion> {
    return this.evaluacionesService.update(id, updateEvaluacionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.evaluacionesService.remove(id);
  }
}


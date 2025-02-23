import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AntecedenteService } from './antecedente.service';
import { CreateAntecedenteDto } from './dto/create-antecedente.dto';

@Controller('antecedente')
export class AntecedenteController {
  constructor(private readonly antecedenteService: AntecedenteService) { }

  @Post()
  create(@Body() createAntecedenteDto: CreateAntecedenteDto) {
    return this.antecedenteService.create(createAntecedenteDto);
  }

  @Get('paciente/:id')
  findAllByPacienteId(@Param('id') pacienteId: number) {
    return this.antecedenteService.findAllByPacienteId(pacienteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.antecedenteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() createDto: CreateAntecedenteDto,
  ) {
    return this.antecedenteService.update(id, createDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.antecedenteService.remove(+id);
  }
}

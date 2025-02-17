import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PesoMaximoService } from './peso-maximo.service';
import { CreatePesoMaximoDto } from './dto/create-peso-maximo.dto';
import { UpdatePesoMaximoDto } from './dto/update-peso-maximo.dto';

@Controller('peso-maximo')
export class PesoMaximoController {
  constructor(private readonly pesoMaximoService: PesoMaximoService) { }

  @Post()
  create(@Body() createPesoMaximoDto: CreatePesoMaximoDto) {
    return this.pesoMaximoService.create(createPesoMaximoDto);
  }

  @Get()
  findAll() {
    return this.pesoMaximoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pesoMaximoService.findOne(+id);
  }

  @Get('/paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.pesoMaximoService.findByPaciente(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePesoMaximoDto: UpdatePesoMaximoDto) {
    return this.pesoMaximoService.update(+id, updatePesoMaximoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pesoMaximoService.remove(+id);
  }
}

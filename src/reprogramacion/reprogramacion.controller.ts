import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReprogramacionService } from './reprogramacion.service';
import { CreateReprogramacionDto } from './dto/create-reprogramacion.dto';
import { UpdateReprogramacionDto } from './dto/update-reprogramacion.dto';

@Controller('reprogramaciones')
export class ReprogramacionController {
  constructor(private readonly service: ReprogramacionService) { }

  @Post()
  create(@Body() dto: CreateReprogramacionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReprogramacionDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}


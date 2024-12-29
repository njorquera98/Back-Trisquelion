import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BonosService } from './bonos.service';
import { CreateBonoDto } from './dto/create-bono.dto';
import { UpdateBonoDto } from './dto/update-bono.dto';
import { Bono } from './entities/bono.entity';

@Controller('bonos')
export class BonosController {
  constructor(private readonly bonosService: BonosService) { }

  @Post()
  async create(@Body() createBonoDto: CreateBonoDto): Promise<Bono> {
    return this.bonosService.create(createBonoDto);
  }

  @Get()
  async findAll(): Promise<Bono[]> {
    return this.bonosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Bono> {
    return this.bonosService.findOne(id);
  }

  @Get('paciente/:id')
  async findByPaciente(@Param('id') id: number): Promise<Bono[]> {
    return this.bonosService.findByPaciente(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBonoDto: Partial<CreateBonoDto>,
  ): Promise<Bono> {
    return this.bonosService.update(id, updateBonoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<string> {
    return this.bonosService.remove(id);
  }
}


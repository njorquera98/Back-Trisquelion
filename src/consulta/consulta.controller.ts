import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { Consulta } from './entities/consulta.entity';
import { Observable } from 'rxjs';

@Controller('consulta')

export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) { }

  // Crear una nueva consulta
  @Post()
  async create(@Body() createConsultaDto: CreateConsultaDto): Promise<Consulta> {
    return this.consultaService.create(createConsultaDto);
  }

  // Obtener todas las consultas
  @Get()
  async findAll(): Promise<Consulta[]> {
    return this.consultaService.findAll();
  }

  // En el controlador de consulta
  @Get('/paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.consultaService.findByPaciente(+id)
  }


  // Obtener una consulta por su ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Consulta> {
    return this.consultaService.findOne(id);
  }

  // Actualizar una consulta
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateConsultaDto: UpdateConsultaDto,
  ): Promise<Consulta> {
    return this.consultaService.update(id, updateConsultaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultaService.remove(+id);
  }
}

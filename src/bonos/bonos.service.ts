import { Injectable } from '@nestjs/common';
import { CreateBonoDto } from './dto/create-bono.dto';
import { UpdateBonoDto } from './dto/update-bono.dto';

@Injectable()
export class BonosService {
  create(createBonoDto: CreateBonoDto) {
    return 'This action adds a new bono';
  }

  findAll() {
    return `This action returns all bonos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bono`;
  }

  update(id: number, updateBonoDto: UpdateBonoDto) {
    return `This action updates a #${id} bono`;
  }

  remove(id: number) {
    return `This action removes a #${id} bono`;
  }
}

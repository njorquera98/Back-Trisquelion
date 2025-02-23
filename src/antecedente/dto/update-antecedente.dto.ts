import { PartialType } from '@nestjs/mapped-types';
import { CreateAntecedenteDto } from './create-antecedente.dto';

export class UpdateAntecedenteDto extends PartialType(CreateAntecedenteDto) {}

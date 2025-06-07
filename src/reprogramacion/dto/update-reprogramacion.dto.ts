import { PartialType } from '@nestjs/mapped-types';
import { CreateReprogramacionDto } from './create-reprogramacion.dto';

export class UpdateReprogramacionDto extends PartialType(CreateReprogramacionDto) {}

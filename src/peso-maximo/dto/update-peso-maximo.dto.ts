import { PartialType } from '@nestjs/mapped-types';
import { CreatePesoMaximoDto } from './create-peso-maximo.dto';

export class UpdatePesoMaximoDto extends PartialType(CreatePesoMaximoDto) { }


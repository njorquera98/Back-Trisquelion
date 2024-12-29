import { PartialType } from "@nestjs/mapped-types";
import { CreateBonoDto } from "./create-bono.dto";
import { IsNumber, IsOptional, MinLength } from "class-validator";

export class UpdateBonoDto extends PartialType(CreateBonoDto) {
  @IsNumber()

  @IsOptional()
  @MinLength(1)
  cantidad: number;

  @IsNumber()
  @IsOptional()
  @MinLength(1)
  valor: number;

}


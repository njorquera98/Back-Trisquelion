import { Test, TestingModule } from '@nestjs/testing';
import { AntecedenteController } from './antecedente.controller';
import { AntecedenteService } from './antecedente.service';

describe('AntecedenteController', () => {
  let controller: AntecedenteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntecedenteController],
      providers: [AntecedenteService],
    }).compile();

    controller = module.get<AntecedenteController>(AntecedenteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

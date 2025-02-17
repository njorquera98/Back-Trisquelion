import { Test, TestingModule } from '@nestjs/testing';
import { PesoMaximoController } from './peso-maximo.controller';
import { PesoMaximoService } from './peso-maximo.service';

describe('PesoMaximoController', () => {
  let controller: PesoMaximoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PesoMaximoController],
      providers: [PesoMaximoService],
    }).compile();

    controller = module.get<PesoMaximoController>(PesoMaximoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

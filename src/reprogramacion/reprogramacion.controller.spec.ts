import { Test, TestingModule } from '@nestjs/testing';
import { ReprogramacionController } from './reprogramacion.controller';
import { ReprogramacionService } from './reprogramacion.service';

describe('ReprogramacionController', () => {
  let controller: ReprogramacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReprogramacionController],
      providers: [ReprogramacionService],
    }).compile();

    controller = module.get<ReprogramacionController>(ReprogramacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

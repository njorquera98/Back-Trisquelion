import { Test, TestingModule } from '@nestjs/testing';
import { BonosController } from './bonos.controller';
import { BonosService } from './bonos.service';

describe('BonosController', () => {
  let controller: BonosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonosController],
      providers: [BonosService],
    }).compile();

    controller = module.get<BonosController>(BonosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

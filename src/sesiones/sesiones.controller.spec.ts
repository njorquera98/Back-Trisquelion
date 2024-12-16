import { Test, TestingModule } from '@nestjs/testing';
import { SesionesController } from './sesiones.controller';
import { SesionesService } from './sesiones.service';

describe('SesionesController', () => {
  let controller: SesionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SesionesController],
      providers: [SesionesService],
    }).compile();

    controller = module.get<SesionesController>(SesionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

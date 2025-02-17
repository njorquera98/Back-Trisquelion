import { Test, TestingModule } from '@nestjs/testing';
import { PesoMaximoService } from './peso-maximo.service';

describe('PesoMaximoService', () => {
  let service: PesoMaximoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PesoMaximoService],
    }).compile();

    service = module.get<PesoMaximoService>(PesoMaximoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

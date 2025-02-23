import { Test, TestingModule } from '@nestjs/testing';
import { AntecedenteService } from './antecedente.service';

describe('AntecedenteService', () => {
  let service: AntecedenteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntecedenteService],
    }).compile();

    service = module.get<AntecedenteService>(AntecedenteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

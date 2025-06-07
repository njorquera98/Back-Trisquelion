import { Test, TestingModule } from '@nestjs/testing';
import { ReprogramacionService } from './reprogramacion.service';

describe('ReprogramacionService', () => {
  let service: ReprogramacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReprogramacionService],
    }).compile();

    service = module.get<ReprogramacionService>(ReprogramacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

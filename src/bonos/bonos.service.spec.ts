import { Test, TestingModule } from '@nestjs/testing';
import { BonosService } from './bonos.service';

describe('BonosService', () => {
  let service: BonosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonosService],
    }).compile();

    service = module.get<BonosService>(BonosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

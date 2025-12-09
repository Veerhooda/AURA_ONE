import { Test, TestingModule } from '@nestjs/testing';
import { VitalsService } from './vitals.service';

describe('VitalsService', () => {
  let service: VitalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VitalsService],
    }).compile();

    service = module.get<VitalsService>(VitalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { VitalsController } from './vitals.controller';

describe('VitalsController', () => {
  let controller: VitalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VitalsController],
    }).compile();

    controller = module.get<VitalsController>(VitalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UnitCoordinatorService } from './unit-coordinator.service';

describe('UnitCoordinatorService', () => {
  let service: UnitCoordinatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitCoordinatorService],
    }).compile();

    service = module.get<UnitCoordinatorService>(UnitCoordinatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

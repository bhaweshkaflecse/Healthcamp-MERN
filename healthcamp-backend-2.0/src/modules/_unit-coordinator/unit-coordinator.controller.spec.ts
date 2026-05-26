import { Test, TestingModule } from '@nestjs/testing';
import { UnitCoordinatorController } from './unit-coordinator.controller';
import { UnitCoordinatorService } from './unit-coordinator.service';

describe('UnitCoordinatorController', () => {
  let controller: UnitCoordinatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitCoordinatorController],
      providers: [UnitCoordinatorService],
    }).compile();

    controller = module.get<UnitCoordinatorController>(UnitCoordinatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

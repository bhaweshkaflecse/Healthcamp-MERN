import { Test, TestingModule } from '@nestjs/testing';
import { CallCentreController } from './call_centre.controller';
import { CallCentreService } from './call_centre.service';

describe('CallCentreController', () => {
  let controller: CallCentreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallCentreController],
      providers: [CallCentreService],
    }).compile();

    controller = module.get<CallCentreController>(CallCentreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

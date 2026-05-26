import { Test, TestingModule } from '@nestjs/testing';
import { CallCentreService } from './call_centre.service';

describe('CallCentreService', () => {
  let service: CallCentreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallCentreService],
    }).compile();

    service = module.get<CallCentreService>(CallCentreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AssignCalendarService } from './_assign_calendar.service';

describe('AssignCalendarService', () => {
  let service: AssignCalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignCalendarService],
    }).compile();

    service = module.get<AssignCalendarService>(AssignCalendarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AssignCalendarController } from './_assign_calendar.controller';
import { AssignCalendarService } from './_assign_calendar.service';

describe('AssignCalendarController', () => {
  let controller: AssignCalendarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignCalendarController],
      providers: [AssignCalendarService],
    }).compile();

    controller = module.get<AssignCalendarController>(AssignCalendarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

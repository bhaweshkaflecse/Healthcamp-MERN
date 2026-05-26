import { Test, TestingModule } from '@nestjs/testing';
import { SubteamController } from './subteam.controller';
import { SubteamService } from './subteam.service';

describe('SubteamController', () => {
  let controller: SubteamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubteamController],
      providers: [SubteamService],
    }).compile();

    controller = module.get<SubteamController>(SubteamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SubteamService } from './subteam.service';

describe('SubteamService', () => {
  let service: SubteamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubteamService],
    }).compile();

    service = module.get<SubteamService>(SubteamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CustomMemberService } from './custom_member.service';

describe('CustomMemberService', () => {
  let service: CustomMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomMemberService],
    }).compile();

    service = module.get<CustomMemberService>(CustomMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

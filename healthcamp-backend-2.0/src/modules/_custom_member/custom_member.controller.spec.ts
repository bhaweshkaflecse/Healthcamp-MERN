import { Test, TestingModule } from '@nestjs/testing';
import { CustomMemberController } from './custom_member.controller';
import { CustomMemberService } from './custom_member.service';

describe('CustomMemberController', () => {
  let controller: CustomMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomMemberController],
      providers: [CustomMemberService],
    }).compile();

    controller = module.get<CustomMemberController>(CustomMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

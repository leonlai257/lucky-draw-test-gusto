import { Test, TestingModule } from '@nestjs/testing';
import { LuckyDrawController } from './lucky-draw.controller';
import { LuckyDrawService } from './lucky-draw.service';

describe('LuckyDrawController', () => {
  let controller: LuckyDrawController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LuckyDrawController],
      providers: [LuckyDrawService],
    }).compile();

    controller = module.get<LuckyDrawController>(LuckyDrawController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

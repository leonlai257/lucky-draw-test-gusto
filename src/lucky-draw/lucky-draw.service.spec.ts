import { Test, TestingModule } from '@nestjs/testing';
import { LuckyDrawService } from './lucky-draw.service';

describe('LuckyDrawService', () => {
  let service: LuckyDrawService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LuckyDrawService],
    }).compile();

    service = module.get<LuckyDrawService>(LuckyDrawService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

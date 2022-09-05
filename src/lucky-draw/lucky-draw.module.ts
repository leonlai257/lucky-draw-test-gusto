import { Module } from '@nestjs/common';
import { LuckyDrawService } from './lucky-draw.service';
import { LuckyDrawController } from './lucky-draw.controller';

@Module({
  controllers: [LuckyDrawController],
  providers: [LuckyDrawService]
})
export class LuckyDrawModule {}

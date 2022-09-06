import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LuckyDrawController } from './lucky-draw.controller';
import { LuckyDrawService } from './lucky-draw.service';

@Module({
  controllers: [LuckyDrawController],
  providers: [LuckyDrawService, PrismaService],
})
export class LuckyDrawModule {}

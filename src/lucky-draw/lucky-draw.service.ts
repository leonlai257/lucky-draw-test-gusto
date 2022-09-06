import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { CronJob } from 'cron';
import { DrawPrizeDto, RedeemPrizeDto } from './dto/lucky-draw.dto';

@Injectable()
export class LuckyDrawService {
  constructor(
    private readonly prisma: PrismaClient,
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  drawPrize(drawPrizeDto: DrawPrizeDto) {
    return 'This action adds a new luckyDraw';
  }

  redeemPrize(redeemPrizeDto: RedeemPrizeDto) {
    return 'This action adds a new luckyDraw';
  }

  async startAutoHandleRecurrencesCronJob(scheduleExpression?: string) {
    const name = 'autoHandleRecurrencesCronJob';

    if (!scheduleExpression) {
      scheduleExpression = this.configService.get(
        'CRON_JOB_RECURRENCES_INTERVAL',
      );
    }

    const autoHandleRecurrencesCronJob = new CronJob(
      scheduleExpression,
      this.dailyResetCronJob,
    );

    this.schedulerRegistry.addCronJob(name, autoHandleRecurrencesCronJob);
    autoHandleRecurrencesCronJob.start();

    return `Cron job autoHandleRecurrencesCronJob added. Cron job param: ${scheduleExpression}`;
  }

  stopDailyResetCronJob() {}

  dailyResetCronJob() {}

  manualDailyReset() {}
}

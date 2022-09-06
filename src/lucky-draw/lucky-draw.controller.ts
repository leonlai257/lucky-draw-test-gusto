import {
  Body, Controller, Delete, Post
} from '@nestjs/common';
import { DrawPrizeDto, RedeemPrizeDto } from './dto/lucky-draw.dto';
import { LuckyDrawService } from './lucky-draw.service';

@Controller('lucky-draw')
export class LuckyDrawController {
  constructor(private readonly luckyDrawService: LuckyDrawService) { }

  @Post()
  drawPrize(@Body() drawPrizeDto: DrawPrizeDto) {
    return this.luckyDrawService.drawPrize(drawPrizeDto);
  }

  @Post('redeem')
  redeemPrize(@Body() redeemPrizeDto: RedeemPrizeDto) {
    return this.luckyDrawService.redeemPrize(redeemPrizeDto);
  }


  // The cronjob apis are used to stop and start the cronjob whenever needed to (e.g. changing schedule)
  @Post('cronjob')
  startDailyResetCronJob(
    @Body() { schedule_expression }: { schedule_expression: string },
  ) {
    return this.luckyDrawService.startDailyResetCronJob(
      schedule_expression,
    );
  }

  @Delete('cronjob')
  stopAutoCaptureCronJob() {
    return this.luckyDrawService.stopDailyResetCronJob();
  }

  // This api can simulate the passing of a day
  @Post('reset')
  manualResetDaily() {
    return this.luckyDrawService.dailyReset();
  }
}

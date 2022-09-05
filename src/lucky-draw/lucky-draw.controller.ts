import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LuckyDrawService } from './lucky-draw.service';
import { DrawPrizeDto, RedeemPrizeDto } from './dto/lucky-draw.dto';

@Controller('lucky-draw')
export class LuckyDrawController {
  constructor(private readonly luckyDrawService: LuckyDrawService) {}

  @Post()
  drawPrize(@Body() drawPrizeDto: DrawPrizeDto) {
    return this.luckyDrawService.drawPrize(drawPrizeDto);
  }

  @Post('redeem')
  redeemPrize(@Body() redeemPrizeDto: RedeemPrizeDto) {
    return this.luckyDrawService.drawPrize(redeemPrizeDto);
  }
}

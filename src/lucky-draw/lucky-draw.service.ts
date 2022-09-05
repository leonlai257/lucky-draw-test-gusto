import { Injectable } from '@nestjs/common';
import { DrawPrizeDto, RedeemPrizeDto } from './dto/lucky-draw.dto';

@Injectable()
export class LuckyDrawService {
  drawPrize(drawPrizeDto: DrawPrizeDto) {
    return 'This action adds a new luckyDraw';
  }

  redeemPrize(redeemPrizeDto: RedeemPrizeDto) {
    return 'This action adds a new luckyDraw';
  }

}

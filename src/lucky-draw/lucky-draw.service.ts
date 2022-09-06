import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import PROBABILITY_RATE from 'src/constant/probability-rates';
import { PrismaService } from 'src/prisma.service';
import { DrawPrizeDto, RedeemPrizeDto } from './dto/lucky-draw.dto';

@Injectable()
export class LuckyDrawService {
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    // The default env uses "0 0 0 * * *", which equals the 00:00 of each day
    const dailyScheduleExpression = this.configService.get(
      'CRON_JOB_DAILY_INTERVAL',
    );

    // Start the cron job everytime the server starts
    this.startDailyResetCronJob(dailyScheduleExpression);
  }

  drawPrize = async (drawPrizeDto: DrawPrizeDto) => {
    const { phone_no } = drawPrizeDto;
    if (!phone_no) {
      return {
        status: "failed",
        result: {
          status: "MISSING_PHONE_NO",
          message: `Please enter your phone no.`
        }
      }
    }

    const user = await this.prisma.users.findFirst({
      where: {
        phone_no: phone_no
      }
    })
    if (!user) {
      await this.prisma.users.create({
        data: {
          phone_no: phone_no,
        }
      });
    }

    if (user.draw_status == 'unavailable') {
      return {
        status: "failed",
        result: {
          status: "ENTERED_ALREADY",
          message: `You have entered the lucky draw for the today. Please come back tomorrow`
        }
      }
    }

    // Draw randomly by specifying the inteval for each prize
    // e.g Buy one get one free coupon is 0 < x <= 800
    const buyOneCouponWeight = PROBABILITY_RATE.coupon.BUY_ONE_GET_ONE;
    const fiveCashCouponWeight = buyOneCouponWeight + PROBABILITY_RATE.coupon.cash.FIVE;
    const twoCashCouponWeight = fiveCashCouponWeight + PROBABILITY_RATE.coupon.cash.TWO;
    const totalWeight = twoCashCouponWeight + PROBABILITY_RATE.NO_PRIZE;
    const randomResult = Math.floor(Math.random() * totalWeight)

    const userUpdated = await this.prisma.users.update({
      where: {
        phone_no: phone_no
      },
      data: {
        draw_status: 'unavailable'
      }
    })

    let prize = '';
    if (randomResult <= buyOneCouponWeight) {
      prize = 'Buy One Get One Free Coupon'
    } else if (randomResult <= fiveCashCouponWeight) {
      prize = 'Two Dollars Cash Coupon'
    } else if (randomResult <= twoCashCouponWeight) {
      prize = 'Five Dollars Cash Coupon'
    } else {
      return {
        status: "success",
        result: {
          status: "SORRY",
          message: `Sorry, you got no prize for today. Please come back tomorrow.`
        }
      }
    }

    const prizeInfo = await this.prisma.prizes_pool.findFirst({
      where: {
        name: prize
      }
    })

    if (prizeInfo.stock && prizeInfo.stock <= 0) {
      return {
        status: "success",
        result: {
          status: "SORRY",
          message: `Sorry, you got no prize for today. Please come back tomorrow.`
        }
      }
    }

    const prizeRecordCreated = await this.prisma.prizes_record.create({
      data: {
        users: {
          connect: {
            phone_no: phone_no
          }
        },
        prizes: {
          connect: {
            id: prizeInfo.id
          }
        },
        status: 'pending'
      }
    })

    if (prizeInfo.stock) {
      const prizePoolUpdated = await this.prisma.prizes_pool.update({
        where: {
          id: prizeInfo.id

        },
        data: {
          stock: prizeInfo.stock - 1
        }
      })
    }

    return {
      status: "success",
      result: {
        status: "success",
        message: `Congratulation! You got a ${prize}!`
      }
    }
  }

  redeemPrize = async (redeemPrizeDto: RedeemPrizeDto) => {
    const { phone_no } = redeemPrizeDto;
    if (!phone_no) {
      return {
        status: "failed",
        result: {
          status: "MISSING_PHONE_NO",
          message: `Please enter your phone no.`
        }
      }
    }

    const user = await this.prisma.users.findFirst({
      where: {
        phone_no: phone_no
      }
    })

    if (!user) {
      return {
        status: "success",
        result: {
          status: "NO_RECORD",
          message: `There is no winning record for this phone no.`
        }
      }
    }

    const prizes = await this.prisma.prizes_record.findMany({
      where: {
        user_id: user.id,
        status: 'pending'
      },
      select: {
        prizes: {
          select: {
            name: true
          }
        }
      }
    })

    if (prizes.length == 0) {
      return {
        message: "success",
        result: {
          status: "NO_UNREDEEMED_PRIZES",
          message: 'There is no unredeemed record for this phone no.'
        }
      }
    }

    const prizeRecordUpdated = await this.prisma.prizes_record.updateMany({
      where: {
        user_id: user.id,
        status: 'pending'
      },
      data: {
        status: 'succeeded'
      }
    })

    return {
      message: "success",
      result: {
        status: "REDEEM_SUCCESS",
        message: prizes
      }
    }
  }

  async startDailyResetCronJob(scheduleExpression?: string) {
    const name = 'dailyResetCronJob';

    if (!scheduleExpression) {
      scheduleExpression = this.configService.get(
        'CRON_JOB_DAILY_INTERVAL',
      );
    }

    const autoHandleRecurrencesCronJob = new CronJob(
      scheduleExpression,
      this.dailyReset,
    );

    this.schedulerRegistry.addCronJob(name, autoHandleRecurrencesCronJob);
    autoHandleRecurrencesCronJob.start();

    return `Cron job dailyResetCronJob added. Cron job param: ${scheduleExpression}`;
  }

  stopDailyResetCronJob = () => {
    this.schedulerRegistry.deleteCronJob('dailyResetCronJob');
    console.log(`Cron job dailyResetCronJob stopped.`);
    return `Cron job dailyResetCronJob stopped.`;
  }

  dailyReset = async () => {
    console.log('Resetting daily data...')
    const currentPrizePool = await this.prisma.prizes_pool.findMany();
    const resetPrize = currentPrizePool.map((prize) => {
      let resetStock = prize.daily_limit;
      if (prize.total_limit < prize.daily_limit) {
        resetStock = prize.total_limit;
      }
      return this.prisma.prizes_pool.update({
        where: {
          id: prize.id,
        },
        data: {
          stock: resetStock,
        }
      })
    })

    const resetUserStatus = await this.prisma.users.updateMany({
      where: {
        draw_status: 'unavailable'
      },
      data: {
        draw_status: 'available'
      }
    })

    return {
      message: "success",
    }
  }
}

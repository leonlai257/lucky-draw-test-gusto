import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LuckyDrawModule } from './lucky-draw/lucky-draw.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [LuckyDrawModule, ScheduleModule.forRoot(), ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env', '.production.env', '.staging.env', '.development.env'],
  }),],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }

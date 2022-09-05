import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LuckyDrawModule } from './lucky-draw/lucky-draw.module';

@Module({
  imports: [LuckyDrawModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

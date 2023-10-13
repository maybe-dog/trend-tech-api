import { Module } from '@nestjs/common';
import { ZennTrendsService } from './zennTrends.service';
import { QiitaTrendsService } from './qiitaTrends.service';
import { HttpModule } from '@nestjs/axios';
import { TrendsController } from './trends.controller';
import { CustomHttpService } from 'src/customHttp.service';

@Module({
  controllers: [TrendsController],
  imports: [HttpModule],
  providers: [ZennTrendsService, QiitaTrendsService, CustomHttpService],
})
export class TrendsModule {}

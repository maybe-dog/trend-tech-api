import { Controller, Get } from '@nestjs/common';
import { ZennTrendsService } from './zennTrends.service';
import { QiitaTrendsService } from './qiitaTrends.service';

/**
 * トレンド記事を取得するコントローラー
 */
@Controller('trends')
export class TrendsController {
  constructor(
    private readonly zennTrendsService: ZennTrendsService,
    private readonly qiitaTrendsService: QiitaTrendsService,
  ) {}

  @Get('/zenn')
  async getZennTrends() {
    return await this.zennTrendsService.getTrends();
  }

  @Get('/qiita')
  async getQiitaTrends() {
    return await this.qiitaTrendsService.getTrends();
  }
}

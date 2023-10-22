import { Controller, Get } from '@nestjs/common';
import { ZennTrendsService } from './zennTrends.service';
import { QiitaTrendsService } from './qiitaTrends.service';
import { QiitaTrendsResponse } from './dto/qiita.dto';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { ZennTrendsResponse } from './dto/zenn.dto';

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
  @ApiOkResponse({ type: ZennTrendsResponse })
  async getZennTrends(): Promise<ZennTrendsResponse> {
    const articles = await this.zennTrendsService.getTrends();
    const total_count = articles.length;
    return { articles: articles, total_count: total_count };
  }

  @Get('/qiita')
  @ApiOkResponse({ type: QiitaTrendsResponse })
  async getQiitaTrends(): Promise<QiitaTrendsResponse> {
    const items = await this.qiitaTrendsService.getTrends();
    const total_count = items.length;
    return { items: items, total_count: total_count };
  }
}

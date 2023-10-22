import { Injectable, Logger } from '@nestjs/common';
import { TrendsInterface } from './trends.interface';
import { CustomHttpService } from 'src/customHttp.service';
import { ConfigService } from '@nestjs/config';
import { notNull } from 'src/utils/typeUtil';
import { QiitaItem } from './dto/qiita.dto';

/**
 * Qiitaのトレンド記事を取得するサービス
 */
@Injectable()
export class QiitaTrendsService implements TrendsInterface {
  private readonly baseUrl = 'https://qiita.com/api/v2';
  private readonly API_KEY: string;
  constructor(
    private readonly customHttpService: CustomHttpService,
    private readonly configService: ConfigService,
  ) {
    this.API_KEY = this.configService.get<string>('QIITA_ACCESS_TOKEN') || '';
  }

  /**
   * Qiitaのトレンド記事を取得
   * 上位100件の記事を取得する
   */
  async getTrends(): Promise<QiitaItem[]> {
    const promises = [];
    const maxPage = 5;
    for (let i = 1; i <= maxPage; i++) {
      promises.push(this.getItems({ page: i, per_page: 100 }));
    }
    const articles = (await Promise.all(promises)).flat().filter(notNull);
    const sortedArticles = articles.sort((a, b) => {
      return b.likes_count - a.likes_count;
    });
    if (sortedArticles.length > 100) {
      return sortedArticles.slice(0, 100);
    } else {
      return sortedArticles;
    }
  }

  /**
   * Qiitaの投稿を取得
   */
  async getItems(params: QiitaItemRequestParams): Promise<QiitaItem[] | null> {
    const articles: QiitaItem[] = await this.customHttpService.get<QiitaItem[]>(
      this.baseUrl + '/items',
      {
        params: params,
        headers: { Authorization: `Bearer ${this.API_KEY}` },
      },
    );
    Logger.debug(`Bearer ${this.API_KEY}`);
    return articles;
  }
}

export type QiitaItemRequestParams = {
  page?: number;
  per_page?: number;
  query?: string;
};

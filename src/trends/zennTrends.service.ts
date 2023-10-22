import { Injectable } from '@nestjs/common';
import { CustomHttpService } from 'src/customHttp.service';
import { TrendsInterface } from './trends.interface';
import { Article } from './dto/zenn.dto';
import { ZennArticleResponse } from './dto/zenn.dto';

/**
 * Zennのトレンド記事を取得するサービス
 */
@Injectable()
export class ZennTrendsService implements TrendsInterface {
  private readonly baseUrl = 'https://zenn.dev/api';
  constructor(private readonly customHttpService: CustomHttpService) {}

  /**
   * Zennのトレンド記事を取得
   * 上位100件の記事を取得する
   */
  async getTrends(): Promise<Article[]> {
    const articles = await this.getArticles({ order: 'daily', count: 100 });
    if (!articles) {
      return [];
    }
    if (articles.length > 100) {
      return articles.slice(0, 100);
    } else {
      return articles;
    }
  }

  /**
   * Zennの記事を取得
   * @param params
   * @returns
   */
  async getArticles(
    params: ZennArticleRequestParams,
  ): Promise<Article[] | null> {
    const response = await this.customHttpService.get<ZennArticleResponse>(
      this.baseUrl + '/articles',
      { params },
    );
    return response.articles;
  }
}

type ZennArticleRequestParams = {
  order?: 'daily' | 'weekly' | 'monthly';
  topicname?: string;
  count?: number;
};

import { Injectable } from '@nestjs/common';
import { CustomHttpService } from 'src/customHttp.service';
import { TrendsInterface } from './trends.interface';

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

type ZennArticleResponse = {
  articles: Article[];
  next_page: number | null;
};

export type Article = {
  id: number;
  post_type: 'Article';
  title: string;
  slug: string;
  published: boolean;
  comments_count: number;
  liked_count: number;
  body_letters_count: number;
  article_type: 'tech' | 'idea';
  emoji: string;
  is_suspending_private: boolean;
  published_at: string;
  body_updated_at: string;
  source_repo_updated_at: string;
  path: string;
  user: User;
  publication: Publication | null;
};

type User = {
  id: number;
  username: string;
  name: string;
  avatar_small_url: string;
};

type Publication = {
  id: number;
  name: string;
  avatar_small_url: string;
  display_name: string;
  beta_stats: boolean;
  avatar_registered: boolean;
};

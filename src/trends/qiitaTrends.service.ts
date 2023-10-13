import { Injectable } from '@nestjs/common';
import { TrendsInterface } from './trends.interface';
import { CustomHttpService } from 'src/customHttp.service';
import { ConfigService } from '@nestjs/config';
import { notNull } from 'src/utils/typeUtil';

/**
 * Qiitaのトレンド記事を取得するサービス
 */
@Injectable()
export class QiitaTrendsService implements TrendsInterface {
  private readonly baseUrl = 'https://qiita.com/api/v2';
  private readonly max_page = 10;
  private readonly API_KEY: string;
  constructor(
    private readonly customHttpService: CustomHttpService,
    private readonly configService: ConfigService,
  ) {
    this.API_KEY = this.configService.get<string>('QIITA_API_KEY') || '';
  }

  /**
   * Qiitaのトレンド記事を取得
   */
  async getTrends(): Promise<QiitaArticle[]> {
    const promises = [];
    for (let i = 1; i <= this.max_page; i++) {
      promises.push(this.getItems({ page: i, per_page: 100 }));
    }
    const articles = (await Promise.all(promises)).flat().filter(notNull);
    const sorted_articles = articles.sort((a, b) => {
      return b.likes_count - a.likes_count;
    });
    return sorted_articles;
  }

  /**
   * Qiitaの投稿を取得
   */
  async getItems(
    params: QiitaItemRequestParams,
  ): Promise<QiitaArticle[] | null> {
    const articles: QiitaArticle[] = await this.customHttpService.get<
      QiitaArticle[]
    >(this.baseUrl + '/items', {
      params: params,
      headers: { Authorization: `Bearer ${this.API_KEY}` },
    });
    return articles;
  }
}

type QiitaItemRequestParams = {
  page?: number;
  per_page?: number;
  query?: string;
};

type QiitaArticle = {
  rendered_body: string;
  body: string;
  coediting: boolean;
  comments_count: number;
  created_at: string;
  group?: null;
  id: string;
  likes_count: number;
  private: boolean;
  reactions_count: number;
  stocks_count: number;
  tags?: TagsEntity[] | null;
  title: string;
  updated_at: string;
  url: string;
  user: User;
  page_views_count?: null;
  team_membership?: null;
  organization_url_name?: null;
  slide: boolean;
};
type TagsEntity = {
  name: string;
  versions?: null[] | null;
};
type User = {
  description: string;
  facebook_id: string;
  followees_count: number;
  followers_count: number;
  github_login_name?: null;
  id: string;
  items_count: number;
  linkedin_id: string;
  location: string;
  name: string;
  organization: string;
  permanent_id: number;
  profile_image_url: string;
  team_only: boolean;
  twitter_screen_name?: null;
  website_url: string;
};

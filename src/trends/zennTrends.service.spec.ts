import { Test, TestingModule } from '@nestjs/testing';
import { ZennTrendsService } from './zennTrends.service';
import { Article } from './dto/zenn.dto';
import { CustomHttpService } from 'src/customHttp.service';
import { HttpModule } from '@nestjs/axios';

const genArticle = (): Article => {
  const dummyUser = {
    id: 1,
    username: 'dummy_user',
    name: 'Dummy User',
    avatar_small_url: 'https://example.com/avatar.jpg',
  };

  const dummyPublication = {
    id: 1,
    name: 'Dummy Publication',
    avatar_small_url: 'https://example.com/publication_avatar.jpg',
    display_name: 'Dummy Display Name',
    beta_stats: true,
    avatar_registered: true,
  };

  return {
    id: 1,
    post_type: 'Article',
    title: 'Dummy Article',
    slug: 'dummy-article',
    published: true,
    comments_count: 10,
    liked_count: 20,
    body_letters_count: 500,
    article_type: 'tech',
    emoji: '📚',
    is_suspending_private: false,
    published_at: '2023-10-22',
    body_updated_at: '2023-10-22',
    source_repo_updated_at: '2023-10-22',
    path: '/dummy-article',
    user: dummyUser,
    publication: dummyPublication,
  };
};

describe('ZennTrendServiceの単体テスト', () => {
  let service: ZennTrendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZennTrendsService],
      imports: [HttpModule],
      providers: [CustomHttpService],
    }).compile();

    service = module.get<ZennTrendsService>(ZennTrendsService);

    // 実際にURLを叩かないよう念のためモック
    Object.defineProperty(service, 'baseUrl', {
      value: 'https://example.com',
    });

    // getAricles()のモック
    jest.spyOn(service, 'getArticles').mockImplementation(async (params) => {
      params.count = params.count || 100;
      const articles = [];
      for (let i = 0; i < params.count; i++) {
        articles.push(genArticle());
      }
      return articles;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getTrends()で100件取れること', async () => {
    const articles = await service.getTrends();
    expect(articles.length).toBe(100);
    expect(articles[0].title).toBeDefined();
  });

  it('getArticles()で正常に取得できること', async () => {
    const count = 10;
    const articles = await service.getArticles({
      order: 'daily',
      count: count,
    });
    expect(articles).toBeDefined();
    expect(articles?.length).toBe(10);
    expect(articles?.[0].title).toBeDefined();
  });
});

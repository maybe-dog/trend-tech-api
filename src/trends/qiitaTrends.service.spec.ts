import { Test, TestingModule } from '@nestjs/testing';
import { QiitaItem, QiitaTrendsService } from './qiitaTrends.service';
import { CustomHttpService } from 'src/customHttp.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import configuration from 'src/config/configuration';
import { generateRandomNumber, generateRandomString } from 'test/utils/random';

const genItem = (): QiitaItem => {
  return {
    rendered_body: 'Mock rendered body',
    body: 'Mock body',
    coediting: false,
    comments_count: 0,
    created_at: '2023-10-22T00:00:00Z',
    id: 'mock-article-id',
    likes_count: generateRandomNumber(0, 100),
    private: false,
    reactions_count: 0,
    stocks_count: 0,
    tags: [{ name: 'Tag1' }, { name: 'Tag2' }],
    title: generateRandomString(20),
    updated_at: '2023-10-22T00:00:00Z',
    url: 'https://example.com/mock-article',
    user: {
      description: 'Mock user description',
      facebook_id: 'mock-fb-id',
      followees_count: 0,
      followers_count: 0,
      github_login_name: null,
      id: 'mock-user-id',
      items_count: 0,
      linkedin_id: 'mock-linkedin-id',
      location: 'Mock City',
      name: 'Mock User',
      organization: 'Mock Organization',
      permanent_id: 1,
      profile_image_url: 'https://example.com/mock-avatar.png',
      team_only: false,
      twitter_screen_name: null,
      website_url: 'https://example.com/mock-user',
    },
    slide: false,
  };
};

describe('QiitaTrendServiceの単体テスト', () => {
  let service: QiitaTrendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QiitaTrendsService],
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test.local', `.env.test`, '.env'],
          load: [configuration],
        }),
      ],
      providers: [CustomHttpService],
    }).compile();

    service = module.get<QiitaTrendsService>(QiitaTrendsService);

    // 実際にAPIを叩かないよう念のためモック
    Object.defineProperty(service, 'baseUrl', {
      value: 'baseUrl',
    });

    // getItems()のモックを作成
    jest.spyOn(service, 'getItems').mockImplementation(async (params) => {
      params.page = params.page || 1;
      params.per_page = params.per_page || 10;
      const items: QiitaItem[] = [];
      for (let i = 0; i < params.per_page; i++) {
        items.push(genItem());
      }
      return items;
    });
  });

  it('it should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getTrends()で100件記事を取得し、like_count順で降順にソート出来ること', async () => {
    const trends = await service.getTrends();
    // 記事数が100件であること
    expect(trends.length).toBe(100);
    // like_countが降順にソートされていること
    for (let i = 0; i < 99; i++) {
      expect(trends[i].likes_count).toBeGreaterThanOrEqual(
        trends[i + 1].likes_count,
      );
    }
  });
});

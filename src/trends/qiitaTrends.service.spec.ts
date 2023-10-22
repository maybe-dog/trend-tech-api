import { Test, TestingModule } from '@nestjs/testing';
import { QiitaTrendsService } from './qiitaTrends.service';
import { QiitaItem } from './dto/qiita.dto';
import { CustomHttpService } from 'src/customHttp.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import configuration from 'src/config/configuration';
import { generateRandomNumber, generateRandomString } from 'test/utils/random';

const genItem = (): QiitaItem => {
  return {
    rendered_body: 'This is the rendered body of the Qiita item.',
    body: 'This is the body of the Qiita item.',
    coediting: false,
    comments_count: 10,
    created_at: '2023-10-22T08:00:00Z',
    group: {
      created_at: '2023-10-20T12:00:00Z',
      description: 'Sample group',
      name: 'Sample Group',
      private: false,
      updated_at: '2023-10-20T12:30:00Z',
      url_name: 'sample-group',
    },
    id: '1234567890abcdef',
    likes_count: generateRandomNumber(0, 100),
    private: false,
    reactions_count: 15,
    stocks_count: 30,
    tags: [
      {
        name: 'JavaScript',
        versions: ['ES6', 'ES7'],
      },
      {
        name: 'Web Development',
      },
    ],
    title: generateRandomString(20),
    updated_at: '2023-10-22T10:00:00Z',
    url: 'https://qiita.com/sample-item',
    user: {
      description: 'Sample user description',
      facebook_id: 'facebook123',
      followees_count: 50,
      followers_count: 100,
      github_login_name: 'sampleUser',
      id: 'user123',
      items_count: 5,
      linkedin_id: 'linkedin123',
      location: 'Sample City',
      name: 'John Doe',
      organization: 'Sample Organization',
      permanent_id: 9876543210,
      profile_image_url: 'https://example.com/sample-user-image.jpg',
      team_only: false,
      twitter_screen_name: 'sample_twitter',
      website_url: 'https://example.com/sample-user-website',
    },
    page_views_count: 500,
    team_membership: {
      name: 'Sample Team',
    },
    organization_url_name: 'sample-org',
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
      value: 'https://example.com',
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

import { Test, TestingModule } from '@nestjs/testing';
import { QiitaTrendsService } from './qiitaTrends.service';
import { CustomHttpService } from 'src/customHttp.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import configuration from 'src/config/configuration';

describe('QiitaTrendServiceの単体テスト', () => {
  let service: QiitaTrendsService;
  let configService: ConfigService;

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
    configService = module.get<ConfigService>(ConfigService);
  });

  it('it should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Qiitaのアクセストークンが設定されていること', () => {
    expect(configService.get<string>('QIITA_ACCESS_TOKEN')).not.toBe('');
  });

  it('getTrends()で100件取れること', async () => {
    const articles = await service.getTrends();
    expect(articles.length).toBe(100);
    expect(articles[0].title).toBeDefined();
  });

  it('getArticles()で正常に取得できること', async () => {
    const numPage = 10;
    const articles = await service.getItems({
      page: 1,
      per_page: numPage,
    });
    expect(articles).toBeDefined();
    expect(articles?.length).toBe(numPage);
    expect(articles?.[0].title).toBeDefined();
  });
});

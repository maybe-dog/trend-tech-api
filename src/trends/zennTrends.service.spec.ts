import { Test, TestingModule } from '@nestjs/testing';
import { ZennTrendsService } from './zennTrends.service';
import { CustomHttpService } from 'src/customHttp.service';
import { HttpModule } from '@nestjs/axios';

describe('ZennTrendServiceの単体テスト', () => {
  let service: ZennTrendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZennTrendsService],
      imports: [HttpModule],
      providers: [CustomHttpService],
    }).compile();

    service = module.get<ZennTrendsService>(ZennTrendsService);
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

import { Test, TestingModule } from '@nestjs/testing';
import { TrendsController } from './trends.controller';
import { CustomHttpService } from 'src/customHttp.service';
import { QiitaTrendsService } from './qiitaTrends.service';
import { ZennTrendsService } from './zennTrends.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

describe('TrendsController', () => {
  let controller: TrendsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrendsController],
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test.local', `.env.test`, '.env'],
          load: [configuration],
        }),
      ],
      providers: [ZennTrendsService, QiitaTrendsService, CustomHttpService],
    }).compile();

    controller = module.get<TrendsController>(TrendsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

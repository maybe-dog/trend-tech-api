import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { catchError, lastValueFrom } from 'rxjs';

/**
 * カスタムHTTPサービス
 * TODO: API呼び出し制限とかに対応するためにキャッシュ機能とか持たせたい
 */
@Injectable()
export class CustomHttpService {
  constructor(private readonly httpService: HttpService) {}

  async get<T>(...args: getArgs): Promise<T> {
    const observable = this.httpService.get<T>(...args);
    const { data } = await lastValueFrom(
      observable.pipe(
        catchError((err, caught) => {
          Logger.error(err, caught);
          throw new InternalServerErrorException();
        }),
      ),
    );
    return data;
  }
}

type getArgs = Parameters<HttpService['get']>;

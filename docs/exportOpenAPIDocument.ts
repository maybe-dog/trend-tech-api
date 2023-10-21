// これはNestJSのOpenAPIドキュメントをYAML形式で出力するスクリプトです。
// 本番では使わないので、開発環境でのみ使ってください。

import * as fs from 'fs';
import { dump } from 'js-yaml';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/app.module';
import { NestFactory } from '@nestjs/core';

const exportOpenAPIDocument = async () => {
  const app = await NestFactory.create(AppModule);

  const documentBuilder = new DocumentBuilder()
    .setTitle('trend-tech-api')
    .setDescription('trend-tech-api API仕様書')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  fs.writeFileSync('./docs/openapi.yaml', dump(document, {}));
};

(async () => await exportOpenAPIDocument())();

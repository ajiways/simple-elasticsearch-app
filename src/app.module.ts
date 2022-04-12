import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { AppController } from './app.controller';
import { ELK_PASSWORD, ELK_URL, ELK_USER } from './config/config';
import { SearchService } from './search.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: ELK_URL,
      auth: {
        username: ELK_USER,
        password: ELK_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [SearchService],
})
export class AppModule {}

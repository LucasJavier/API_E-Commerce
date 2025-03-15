import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ConfigModule.forRoot(),CategoryModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ReportModule } from './report/report.module';
import { AppController } from './app.controller';

@Module({
  imports: [ReportModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

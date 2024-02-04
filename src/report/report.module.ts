import { Module } from '@nestjs/common';
import { ReportService } from './services/report.service';
import { ReportController } from './report.controller';
import { HttpModule } from '@nestjs/axios';
import { ProductService } from './services/product.service';
import { CurrencyService } from './services/currency.service';

@Module({
  imports: [HttpModule],
  controllers: [ReportController],
  providers: [ReportService, ProductService, CurrencyService],
})
export class ReportModule {}

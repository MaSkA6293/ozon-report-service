import { Injectable } from '@nestjs/common';
import { concat, reduce, of } from 'rxjs';
import 'dotenv/config';
import { ProductService } from './product.service';
import { CurrencyService } from './currency.service';
import { RealizationReportService } from './realization-report.service';
import { ParseOrderService } from './parse-order.service';

export interface ReportServiceCreate {
  fbo?: Express.Multer.File[];
  fbs?: Express.Multer.File[];
  report?: Express.Multer.File[];
}

@Injectable()
export class ReportService {
  constructor(
    private productService: ProductService,
    private currencyService: CurrencyService,
    private realizationReportService: RealizationReportService,
    private parseOrderService: ParseOrderService,
  ) {}

  async create({ fbo, fbs, report }: ReportServiceCreate) {
    const realizationReport = this.realizationReportService.parse(report);

    const parseOrderService = await this.parseOrderService.parse(fbo, fbs);

    return concat(
      this.productService.getAllProducts(),
      this.currencyService.getCurrencyRange(),
      of(realizationReport),
      of(parseOrderService),
    ).pipe(
      reduce((acc, one) => {
        acc[Object.keys(one)[0]] = one[Object.keys(one)[0]];
        return acc;
      }, {}),
    );
  }
}

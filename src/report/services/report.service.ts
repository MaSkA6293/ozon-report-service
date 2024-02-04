import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { concat, tap, reduce, of } from 'rxjs';
import 'dotenv/config';
import { ProductService } from './product.service';
import { CurrencyService } from './currency.service';
import { RealizationReportService } from './realization-report.service';

export interface ReportServiceCreate {
  fbo?: Express.Multer.File[];
  fbs?: Express.Multer.File[];
  report?: Express.Multer.File[];
}

@Injectable()
export class ReportService {
  constructor(
    private http: HttpService,
    private productService: ProductService,
    private currencyService: CurrencyService,
    private realizationReportService: RealizationReportService,
  ) {}

  create({ report }: ReportServiceCreate) {
    const realizationReport = this.realizationReportService.parse(report);

    const results = concat(
      this.productService.getAllProducts(),
      this.currencyService.getCurrencyRange(),
      of(realizationReport),
    ).pipe(
      reduce((acc, one) => {
        acc[Object.keys(one)[0]] = one[Object.keys(one)[0]];
        return acc;
      }, {}),
      tap((data) => {
        console.log(data);
      }),
    );

    return results;
  }
}

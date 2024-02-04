import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { concat, tap, reduce } from 'rxjs';
import 'dotenv/config';
import { ProductService } from './product.service';
import { CurrencyService } from './currency.service';

@Injectable()
export class ReportService {
  constructor(
    private http: HttpService,
    private productService: ProductService,
    private currencyService: CurrencyService,
  ) {}

  create() {
    return concat(
      this.productService.getAllProducts(),
      this.currencyService.getCurrencyRange(),
    )
      .pipe(
        reduce((acc, one) => {
          acc[Object.keys(one)[0]] = one[Object.keys(one)[0]];
          return acc;
        }, {}),
        tap((data) => {
          console.log(data);
        }),
      )
      .subscribe();
  }
}

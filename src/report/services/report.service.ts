import { Injectable } from '@nestjs/common';
import { concat, reduce, of, map } from 'rxjs';
import 'dotenv/config';
import { ProductService } from './product.service';
import { CurrencyService } from './currency.service';
import { RealizationReportService } from './realization-report.service';
import { ParseOrderService } from './parse-order.service';
import { ContentService } from './content.service';
import { SaveReportService } from './save-report.service';

export interface ReportServiceCreate {
  fbo?: Express.Multer.File[];
  fbs?: Express.Multer.File[];
  report?: Express.Multer.File[];
}

@Injectable()
export class ReportService {
  countries = ['Армения', 'Кыргызстан', 'Казахстан', 'Беларусь'];

  constructor(
    private productService: ProductService,
    private currencyService: CurrencyService,
    private realizationReportService: RealizationReportService,
    private parseOrderService: ParseOrderService,
    private contentService: ContentService,
    private saveReportService: SaveReportService,
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
      reduce((acc, curr) => {
        Object.keys(curr).forEach((key) => {
          acc[key] = curr[key];
        });
        return acc;
      }, {}),
      map((data: any) => {
        const reports = this.countries.map((countryName) => {
          return this.getReport(
            countryName,
            { fbo: data.fbo, fbs: data.fbs },
            data.realizationReport,
            data.currencyRange,
            data.products,
          );
        });
        const fileName = this.saveReportService.save(reports);
        return fileName;
      }),
    );
  }

  getReport(countryName, orders, realizationReport, range, products) {
    const entries = this.parseOrderService.retrieveOrders(orders, countryName);

    const content = this.contentService.getContent(
      entries,
      range,
      realizationReport,
      products,
    );

    return {
      sheet: countryName,
      columns: [
        { label: 'Тип', value: 'type' },
        { label: 'Номер отправления', value: 'Номер отправления' },
        { label: 'Дата отгрузки', value: 'Дата отгрузки' },
        { label: 'Доставлен', value: 'Доставлен' },

        { label: 'Наименование', value: 'Наименование' },
        { label: 'Ozon ID', value: 'ozon id' },
        { label: 'Артикул', value: 'Артикул' },
        {
          label: 'Сумма отправления',
          value: (row) => row['Сумма отправления'],
        },
        {
          label: 'Цена реализации',
          value: (row) => row['Цена реализации'],
        },
        { label: 'Цена доллара', value: 'Цена доллара' },
        { label: 'Цена товара в долларах', value: 'Цена товара в долларах' },
        { label: 'Вес товара', value: 'Вес товара' },
      ],
      content: [...content],
    };
  }
}

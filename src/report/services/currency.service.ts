import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { catchError, map, merge } from 'rxjs';
import { xml2js } from 'xml-js';

@Injectable()
export class CurrencyService {
  constructor(private http: HttpService) {}

  public getCurrencyRange() {
    const to = moment().format('DD/MM/YYYY');
    const from = moment().subtract(100, 'days').format('DD/MM/YYYY');

    const url = `https://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${from}&date_req2=${to}&VAL_NM_RQ=R01235`;

    return this.http
      .get(url)
      .pipe(
        map((res) => {
          const xml = res.data;
          const currencyObj = xml2js(xml, { compact: true });
          return { currencyRange: this.transform(currencyObj) };
        }),
        merge,
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('Currency service is not available');
        }),
      );
  }

  private transform = (json) => {
    return json['ValCurs']['Record'].map((item) => {
      const date = item['_attributes']['Date'].split('.').reverse().join('-');

      return {
        date,
        value: item['Value']['_text'],
      };
    });
  };
}

import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { catchError, map, merge } from 'rxjs';

@Injectable()
export class ProductService {
  private allProductsUrl = `https://api-seller.ozon.ru/v3/products/info/attributes`;

  constructor(private http: HttpService) {}

  getAllProducts() {
    const headers = {
      'Client-Id': process.env.CLIENT_ID,
      'Api-Key': process.env.API_KEY,
      'Content-Type': 'application/json',
    };

    const body = {
      filter: {
        visibility: 'ALL',
      },
      limit: 1000,
      sort_dir: 'ASC',
    };

    return this.http
      .post(this.allProductsUrl, JSON.stringify(body), { headers })
      .pipe(
        map((response) => {
          return {
            products: response.data.result.map(({ offer_id, weight }) => {
              return {
                offer_id,
                weight,
              };
            }),
          };
        }),
        merge,
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('Products service is not available');
        }),
      );
  }
}

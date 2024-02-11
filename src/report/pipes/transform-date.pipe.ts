import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformDatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const [month, year] = value.reportDate.split('/');
    return {
      reportDate: `${year}-${month}`,
      countries: JSON.parse(value.countries),
    };
  }
}

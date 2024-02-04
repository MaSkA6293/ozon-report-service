import { Injectable } from '@nestjs/common';
import * as csv from 'csvtojson';

@Injectable()
export class ParseOrderService {
  async parse(fbo?: Express.Multer.File[], fbs?: Express.Multer.File[]) {
    try {
      const orders = {
        fbo: fbo[0].buffer,
        fbs: fbs[0].buffer,
      };

      const promises = Object.keys(orders).map((key) => {
        return csv({
          delimiter: key === 'fbs' ? ';' : 'auto',
          noheader: true,
          output: 'csv',
          trim: false,
        }).fromString(orders[key].toString('utf8'));
      });
      return await Promise.all(promises).then((data) => {
        const [fbo, fbs] = data;
        return { fbo, fbs };
      });
    } catch (err) {
      console.error(err.message);
    }
  }
}

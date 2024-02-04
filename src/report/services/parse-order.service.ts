import { Injectable } from '@nestjs/common';
import * as csv from 'csvtojson';
import * as moment from 'moment';

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

  retrieveOrders = (orders, countryName) => {
    return Object.keys(orders)
      .map((key) => {
        switch (key) {
          case 'fbo':
            const ordersFbo = orders[key].filter(
              (item) =>
                item[23].trim().toLowerCase() ===
                countryName.trim().toLowerCase(),
            );
            if (ordersFbo.length) {
              return ordersFbo.map((order) => {
                return {
                  orderType: key,
                  'Номер отправления': order[1],
                  'Дата отгрузки': order[3],
                  'Дата доставки': order[5],
                  'Сумма отправления': Number(order[6]),
                  Наименование: order[8],
                  'ozon id': order[9],
                  Артикул: order[10],
                };
              });
            }
            return undefined;
          case 'fbs':
            const ordersFbs = orders[key].filter(
              (item) => item[24] === countryName,
            );
            if (ordersFbs.length) {
              return ordersFbs.map((order) => {
                return {
                  orderType: key,
                  'Номер отправления': order[1],
                  'Дата отгрузки': order[3],
                  'Дата доставки': order[5],
                  'Сумма отправления': Number(order[6]),
                  Наименование: order[8],
                  'ozon id': order[9],
                  Артикул: order[10],
                };
              });
            }
            return undefined;
        }
      })
      .filter((key) => key !== undefined)
      .map((key) => key.filter((order) => order['Дата доставки'] !== ''))
      .map((key) =>
        key.filter((order) => {
          const deliveryDate = moment(order['Дата доставки']);
          const rangeStart = moment()
            .subtract(1, 'months')
            .set('date', 1)
            .set('hour', 0)
            .set('minute', 0)
            .set('second', 0);

          if (deliveryDate >= rangeStart) {
            return true;
          }
        }),
      )
      .map((key) =>
        key.filter((order) => {
          const shipmentDate = moment(order['Дата отгрузки']);
          const rangeStart = moment()
            .subtract(1, 'months')
            .set('date', 1)
            .set('hour', 0)
            .set('minute', 0)
            .set('second', 0);

          const rangeEnd = moment()
            .set('date', 1)
            .set('hour', 0)
            .set('minute', 0)
            .set('second', 0);

          if (shipmentDate <= rangeEnd && shipmentDate >= rangeStart) {
            return true;
          }
        }),
      )
      .sort((key) =>
        key.sort((a, b) => {
          if (moment(a['Дата доставки']) < moment(b['Дата доставки'])) {
            return -1;
          }
          if (moment(a['Дата доставки']) > moment(b['Дата доставки'])) {
            return -1;
          } else return 0;
        }),
      )
      .flat();
  };
}

import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class ContentService {
  getContent = (entries, range, realizationReport, products) => {
    return entries.map((order) => {
      const dollarRate = this.getDollarRate(order['Дата отгрузки'], range);
      const price = this.getRealizationPrice(
        order['Номер отправления'],
        realizationReport,
        dollarRate,
      );
      let realizationPrice = '';
      let dollarPrice = Number(
        (order['Сумма отправления'] / Number(dollarRate)).toFixed(9),
      );
      if (price) {
        [realizationPrice, dollarPrice] = price;
      }

      const product = products.find(
        (product) =>
          product.offer_id.toLowerCase() === order['Артикул'].toLowerCase(),
      );
      let weight = 0;

      if (product !== undefined) {
        weight = product.weight / 1000;
      }

      const deliveryDate = order['Дата доставки']
        ? moment(order['Дата доставки']).format('DD.MM.YYYY hh:mm')
        : 'undefined';

      const shippingDate = order['Дата отгрузки']
        ? moment(order['Дата отгрузки']).format('DD.MM.YYYY')
        : 'undefined';

      return {
        type: order.orderType,
        'Номер отправления': order['Номер отправления'],
        'Дата отгрузки': shippingDate,
        Доставлен: deliveryDate,
        Наименование: order['Наименование'],
        'ozon id': order['ozon id'],
        Артикул: order['Артикул'],
        'Сумма отправления': order['Сумма отправления'],
        'Цена реализации': realizationPrice,
        'Цена доллара': dollarRate,
        'Цена товара в долларах': dollarPrice,
        'Вес товара': weight,
      };
    });
  };

  getDollarRate = (date, range) => {
    if (!date) return 'undefined';
    const momentDate = moment(date);
    let rangeDateKey = momentDate.format('YYYY-MM-DD');
    const rangeBegin = moment(range[0].date).format('YYYY-MM-DD');

    let flag = true;

    while (flag) {
      const record = range.find((item) => item.date === rangeDateKey);
      if (record) {
        flag = false;
      } else {
        rangeDateKey = momentDate.subtract(1, 'days').format('YYYY-MM-DD');
        if (rangeDateKey < rangeBegin) {
          rangeDateKey = 'undefined';
          flag = false;
        }
      }
    }

    if (rangeDateKey) {
      return Number(
        range
          .find((item) => item.date === rangeDateKey)
          .value.replace(/,/, '.'),
      );
    }
    return 'undefined';
  };

  getRealizationPrice = (sendingNumber, realizationReport, dollarRate) => {
    const record = realizationReport.filter((item) => {
      return item[19] === sendingNumber;
    });

    if (record.length === 0) {
      return 0;
    }
    const price = record[0][5];

    let dollarPrice = 0;

    if (dollarRate) {
      dollarPrice = Number((price / dollarRate).toFixed(9));
    }

    return [price, dollarPrice];
  };
}

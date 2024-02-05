import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';
import * as moment from 'moment';

@Injectable()
export class SaveReportService {
  save(reports) {
    const date = moment().format('DD-MM-YYYY');

    const fileName = `report-${date}.xlsx`;

    const workbook = xlsx.utils.book_new();
    reports.forEach((item) => {
      const worksheet = xlsx.utils.json_to_sheet(item.content);
      worksheet['!cols'] = [
        { wch: 6 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 80 },
        { wch: 12 },
        { wch: 10 },
        { wch: 22 },
        { wch: 18 },
        { wch: 15 },
        { wch: 25 },
        { wch: 12 },
      ];
      xlsx.utils.book_append_sheet(workbook, worksheet, item.sheet);
    });
    xlsx.writeFile(workbook, `./src/output/${fileName}`);

    return fileName;
  }
}

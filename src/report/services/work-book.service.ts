import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';

@Injectable()
export class WorkBookService {
  create(reports) {
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

    return workbook;
  }
}

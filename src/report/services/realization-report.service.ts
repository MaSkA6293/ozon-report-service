import { Injectable } from '@nestjs/common';
import xlsx from 'node-xlsx';

@Injectable()
export class RealizationReportService {
  parse(report?: Express.Multer.File[]) {
    try {
      const file = report[0];
      const workSheetsFromBuffer = xlsx.parse(file.buffer);
      return { realizationReport: workSheetsFromBuffer[0].data.slice(15) };
    } catch (err) {
      console.error(err);
    }
  }
}

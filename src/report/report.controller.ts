import { Controller, Post } from '@nestjs/common';
import { ReportService } from './services/report.service';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post()
  create() {
    return this.reportService.create();
  }
}

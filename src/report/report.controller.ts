import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ReportService } from './services/report.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateReportDto } from './dto/create-report.dto';
import { TransformDatePipe } from './pipes/transform-date.pipe';
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fbo', maxCount: 1 },
      { name: 'fbs', maxCount: 1 },
      { name: 'report', maxCount: 1 },
    ]),
  )
  create(
    @Body(new TransformDatePipe()) createReportDto: CreateReportDto,
    @UploadedFiles()
    files: {
      fbo?: Express.Multer.File[];
      fbs?: Express.Multer.File[];
      report?: Express.Multer.File[];
    },
  ) {
    return this.reportService.create(files, createReportDto.reportDate);
  }
}

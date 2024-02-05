import {
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ReportService } from './services/report.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { FileExistsPipe } from './pipes/file-exists.pipe';
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
    @UploadedFiles()
    files: {
      fbo?: Express.Multer.File[];
      fbs?: Express.Multer.File[];
      report?: Express.Multer.File[];
    },
  ) {
    return this.reportService.create(files);
  }

  @Get(':fileName')
  getFile(@Param('fileName', FileExistsPipe) path: string): StreamableFile {
    const file = createReadStream(path);
    return new StreamableFile(file);
  }
}

import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileExistsPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const path = join(process.cwd(), 'src/output', value);
    if (!existsSync(path))
      throw new HttpException(
        `File with the name ${value} isn't exist`,
        HttpStatus.NOT_FOUND,
      );
    return path;
  }
}

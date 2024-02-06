import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty({
    message: 'request body does not contain required fields',
  })
  @IsString()
  reportDate: string;
}

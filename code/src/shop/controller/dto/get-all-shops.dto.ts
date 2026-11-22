import { CursorQueryDto } from '@sellgar/pagination';
import { IsOptional, IsString } from 'class-validator';

export class GetAllShopsDto extends CursorQueryDto {
  @IsOptional()
  @IsString()
  term?: string;
}

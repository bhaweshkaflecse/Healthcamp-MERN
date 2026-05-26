import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateSampleFiletDto {
  @ApiProperty({ required: true, type: 'string', format: 'binary' })
  participantFile: any;
}

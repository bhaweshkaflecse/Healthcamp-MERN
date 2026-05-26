import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';


export class CreateAminProfileDto {
    @ApiProperty({required:false, type: 'string', format: 'binary' })
    @IsOptional()
    profile: any;
  
}

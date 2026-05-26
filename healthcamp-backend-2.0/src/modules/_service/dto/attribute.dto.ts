import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AttributeDto {
    @IsNotEmpty()
    @ApiProperty()
    name: string;
}

import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ArrayNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { AttributeDto } from './attribute.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
    @ApiProperty({ example: 'Service Name', description: 'The name of the service' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Service Description', description: 'The description of the service' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ description: 'Array of attributes related to the service' })
    @IsNotEmpty()
    @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => AttributeDto)
    attributes: string[];
}

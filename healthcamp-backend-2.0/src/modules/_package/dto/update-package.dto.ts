import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PriceDto {
  @IsNumber()
  min: number;

  @IsNumber()
  max: number;

  @IsNumber()
  price: number;
}

export class UpdatePackageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsArray()
  @ApiProperty()
  services: number[];

  @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => PriceDto)
  @ApiProperty({
    example: [
      {
        min: 1,
        max: 10,
        price: 100
      }
    ]
  })
  prices: PriceDto[];
}

export class UpdatePriceDTO {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  min: number

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  max: number

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  price: number
}
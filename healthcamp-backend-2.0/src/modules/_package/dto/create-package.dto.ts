import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PriceDto {
  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value)) 
  min: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  max: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  price: number;
}

export class CreatePackageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty()
  // img: string

  @IsArray()
  @ApiProperty()
  services: string[];

  @IsArray()
  @ApiProperty({
    example: [
      {
        min: 1,
        max: 10,
        price: 100
      }
    ]
  })
  @ValidateNested({ each: true })
  @Type(() => PriceDto)
  prices: PriceDto[];
}

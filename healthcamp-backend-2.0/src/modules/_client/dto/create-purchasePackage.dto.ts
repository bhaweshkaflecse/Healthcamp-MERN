import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNumber, IsEnum, IsOptional, MinLength } from 'class-validator';
import { paymentMode } from 'src/helper/types/index.type';

export class CreatePurchasePackageDto {
  
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @ApiProperty()
    amount: number;

    @IsEnum(paymentMode)
    @ApiProperty()
    paymentMode: paymentMode;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsOptional()
    paymentProof: any;
}

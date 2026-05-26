import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { paymentMode } from "src/helper/types/index.type";

export class CreatePaymentDto {

    
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @ApiProperty()
    participant:number;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @ApiProperty()
    price:number;

    @IsEnum(paymentMode)
    @ApiProperty()
    medium:paymentMode;

   
    @ApiProperty({required:false, type: 'string', format: 'binary' })
    proof: any;

}

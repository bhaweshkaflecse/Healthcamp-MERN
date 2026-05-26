import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { callReasonType, callType } from "src/helper/types/index.type";

export class CreateInqueryDto {
    @IsString() 
    @ApiProperty()
    name: string;

    @IsNumber()
    @Min(10)
    @ApiProperty()
    contact: number;

    @IsString()
    @ApiProperty()
    @IsOptional()
    description?: string;

    @IsEnum(callType)
    @ApiProperty()
    callType: callType;

    @IsEnum(callReasonType)
    @ApiProperty()
    reason: callReasonType;
}
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsUUID } from "class-validator";

export class InsertDateSlotdto {
    @Type(() => Date)
    @IsDate()
    @ApiProperty()
    date: Date

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    isDisabled: boolean

    @IsUUID()
    @ApiProperty()
    calender: string

    @IsNumber()
    @ApiProperty()
    slot: number
}


export class checkIsDateAddedDto {
    @Type(() => Date)
    @IsDate()
    @ApiProperty()
    date: Date

    @IsUUID()
    @ApiProperty()
    calendar: string
}
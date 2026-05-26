import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsUUID } from "class-validator";

export class CreateCalenderDto {
    @IsUUID()
    @ApiProperty()
    service: string
}

export class updateDateSlotDto {
    @IsBoolean()
    @ApiProperty()
    isDisabled: boolean

    @IsNumber()
    @ApiProperty()
    slot: number
}
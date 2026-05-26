import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsBoolean, IsInt, IsNotEmpty, IsUUID, IsString, isISO8601, IsISO8601 } from 'class-validator';

export class CreateEventCalendarDto {
    // @Type(() => Date)
    @IsNotEmpty()
    @IsISO8601()
    @ApiProperty()
    startDate: Date;

    // @Type(() => Date)
    @IsNotEmpty()
    @IsISO8601()
    @ApiProperty()
    endDate: Date;

    @IsBoolean()
    @ApiProperty()
    isDisable: boolean;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    slot: number;

    @IsNotEmpty()
    @ApiProperty()
    @IsUUID()
    enrollId: string; 

    @IsNotEmpty()
    @ApiProperty()
    @IsUUID()
    serviceId: string;

    @IsNotEmpty()
    @ApiProperty()
    clientId: string;
}

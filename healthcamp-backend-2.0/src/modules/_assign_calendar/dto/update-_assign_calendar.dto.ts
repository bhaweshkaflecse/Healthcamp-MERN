import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsBoolean, IsInt, IsNotEmpty, IsUUID, IsString, isISO8601, IsISO8601 } from 'class-validator';

export class UpdateAssignCalendarDto {
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
    serviceId: string;

    @IsNotEmpty()
    @ApiProperty()
    clientId: string;
}

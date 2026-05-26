import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { IsValidDate } from "src/helper/utils/date-validate";

export class CreateBookingDto {
    @IsUUID()
    @ApiProperty()
    serviceCalendarId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    venue: string;

    @IsNotEmpty()
    @IsArray()
    @ApiProperty()
    @IsOptional()
    bookingDates?: string[];

    @IsUUID()
    @ApiProperty()
    eventCalendarId: string;

    @IsUUID()
    @ApiProperty()
    enrollPackageId: string;
}

export class BookingDate{
    @ApiProperty()
    @IsValidDate({ message: 'Booking date should be a valid date and greater than today.' })
    bookingDate: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateEventDto {
    @IsDate()
    @ApiProperty()
    date: string;
}

export class AssignSubteamDto {

    @IsNumber()
    @ApiProperty()
    participant: number;

    @IsArray()
    @ApiProperty()
    subteams: string[];
}
export class EventFeedbackDto {
    @IsNumber()
    @ApiProperty()
    rating: number;

    @IsString()
    @ApiProperty()
    feedback: string;
}

export class changeSubTeamDto {
    @IsString()
    @ApiProperty()
    eventId: string;

    @IsString()
    @ApiProperty()
    subteamId: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsString, IsUUID } from "class-validator";

export class CreateReportDto {
    @IsUUID()
    @ApiProperty()
    eventId: string;

    @IsUUID()
    @ApiProperty()
    serviceId: string;
}

export class entryReportDto {

    @IsString()
    @ApiProperty()
    value:string;
    
    @IsUUID()
    @ApiProperty()
    attributeId: string;

    @IsUUID()
    @ApiProperty()
    participantId: string;
}

export class CreateEntryReportDto {
    @ApiProperty({
        type:[entryReportDto]
    })
    @IsArray()
    report:entryReportDto[]
}

export class GetReportDto {
    @IsUUID()
    @ApiProperty()
    eventId: string;

    @IsUUID()
    @ApiProperty()
    serviceId: string;
}

export class GetparticipantReportDto {
    @IsUUID()
    @ApiProperty()
    reportId: string;

    @IsString()
    @ApiProperty()
    participantId: string;
}

export class CreateForwardReportDto{
    @ApiProperty()
    @IsArray()
    participantIds:string[];
}

export class CreateResultDto{
    @IsString()
    @ApiProperty()
    value:string; 
}


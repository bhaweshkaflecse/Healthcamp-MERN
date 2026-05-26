import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { genderType } from "src/helper/types/index.type";

export class CreateParticpantDto {
    @IsString({ message: 'Name must be a string' })
    @ApiProperty()
    name: string;

    @IsEnum(genderType, { message: 'Gender must be a string' })
    @ApiProperty()
    gender: genderType;

    @IsNumber()
    @ApiProperty()
    grade: number;

    @IsNumber()
    @ApiProperty()
    phone: number;

    @IsEmail()
    @IsOptional()
    @ApiProperty() 
    email?: string;
}

export class CheckParticipantEventDto {
    @IsString()
    @ApiProperty()
    participantId: string;

    @IsUUID()
    @ApiProperty()
    eventId: string;
} 

export class EventListDto{
@IsArray()
@ApiProperty({type:Array})
eventIds:string[]
}
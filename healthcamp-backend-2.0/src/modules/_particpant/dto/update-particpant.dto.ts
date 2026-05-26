
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { genderType } from "src/helper/types/index.type";

export class UpdateParticpantDto {
    @IsString()
    @ApiProperty()
    @IsOptional()
    name: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    participantId: string;

    @IsEnum(genderType)
    @ApiProperty()
    @IsOptional()
    gender: genderType;

    @IsNumber()
    @ApiProperty()
    @IsOptional()
    grade: number;

    @IsString()
    @ApiProperty()
    @IsOptional()
    contact: string;

    @IsEmail()
    @ApiProperty()
    @IsOptional()
    email: string;
}

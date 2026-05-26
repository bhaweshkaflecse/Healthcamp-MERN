import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, MinLength } from 'class-validator';

export class CreateClientDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsEmail({}, { message: 'Please enter a valid email' })
    @ApiProperty()
    email: string;

    @IsString()
    @MinLength(6)
    @ApiProperty()
    password: string;

    @IsString()
    @ApiProperty()
    address: string;

    @IsNumber()
    @ApiProperty()
    primaryLevelParticipant: number;

    @IsNumber()
    @ApiProperty()
    midLevelParticipant: number;

    @IsNumber()
    @ApiProperty()
    higherLevelParticipant: number;

    @IsNumber()
    @ApiProperty()
    contact: number;
}

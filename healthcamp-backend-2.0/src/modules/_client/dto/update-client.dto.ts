import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, Length, Max, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    name?: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty()
    email?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    address?: string;

    @IsOptional()
    @IsNumber()
    @Min(1000000000)
    @Max(9999999999)
    @ApiProperty()
    contact?: number;

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    newRegistration?: boolean
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class UpdateTeamDto {
    @ApiProperty({ description: 'The name of the team', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'The description of the team', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'The members of the team', type: [String], required: false })
    @IsArray()
    @IsOptional()
    memberIds?: string[];
}
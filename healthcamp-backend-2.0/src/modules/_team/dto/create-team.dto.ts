import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateTeamDto {
    @ApiProperty({ description: 'The name of the team' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The description of the team' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'The ID of the team leader', type: String })
    @IsString()
    @IsNotEmpty()
    teamLeaderId: string;

    @ApiProperty({ description: 'The members of the team', type: [String] })
    @IsArray()
    @IsOptional()
    memberIds: string[];
}

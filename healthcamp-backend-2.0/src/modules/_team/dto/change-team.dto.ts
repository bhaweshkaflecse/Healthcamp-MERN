import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray} from 'class-validator';

export class CreateChangeTeamDto {
    @ApiProperty({ description: 'Admin current teamId' })
    @IsString()
    @IsNotEmpty()
    teamId: string;

    @ApiProperty({ description: 'Next teamId where want to switch' })
    @IsString()
    @IsNotEmpty()
    nextTeamId: string;

    @ApiProperty({ description: 'Admin id ' })
    @IsString()
    @IsNotEmpty()
    memberId: string;

}

export class AddMemberDto{
    @ApiProperty({ description: 'Admin ids ' })
    @IsArray()
    @IsNotEmpty()
    memberId: string[];
}
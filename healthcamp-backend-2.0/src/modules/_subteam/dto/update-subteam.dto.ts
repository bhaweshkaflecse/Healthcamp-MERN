
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubteamDto {
    @IsString()
    @ApiProperty({description:'subteam name'})
    @IsOptional()
    name?:string

    @IsString()
    @ApiProperty({description:'subteam description'})
    @IsOptional()
    description?:string
}

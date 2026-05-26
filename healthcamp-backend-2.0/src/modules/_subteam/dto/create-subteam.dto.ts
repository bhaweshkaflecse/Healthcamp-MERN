import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateSubteamDto {
    @IsString()
    @ApiProperty({description:'subteam name'})
    name:string

    @IsString()
    @ApiProperty({description:'subteam description'})
    description:string

    @IsString()
    @ApiProperty({description:'service Id'})
    serviceId:string

    @ApiProperty({ description: 'The members of the team', type: [String] })
    @IsArray()
    memberIds: string[];
}

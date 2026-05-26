import { ApiProperty } from "@nestjs/swagger";

export class CreateProfileDto {
    @ApiProperty({type:'string', format:'binary' })
    profile: any;
}
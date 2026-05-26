import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class signInDTO {
    @IsEmail()
    @ApiProperty()
    email: string

    @IsString()
    @ApiProperty()
    password: string
}

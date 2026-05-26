import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class MailToken {
    @IsEmail()
    @ApiProperty()
    email: string
}

export class updatePasswordDTO {
    // @IsString()
    // @ApiProperty()
    // token: string

    @IsString()
    @ApiProperty()
    oldPassword: string

    @IsString()
    @ApiProperty()
    password: string
}

export class resetPasswordDTO {
    @IsString()
    @ApiProperty()
    token: string

    @IsString()
    @ApiProperty()
    password: string

    @IsEmail()
    @ApiProperty()
    email: string
}
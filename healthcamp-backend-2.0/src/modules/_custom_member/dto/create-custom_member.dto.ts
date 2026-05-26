import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNumber, IsOptional, IsString,MinLength, Validate, ValidateIf } from "class-validator";

export class CreateCustomMemberDto {
    @ValidateIf((o) => o.name !== '' && o.name !== undefined)
    @IsString()
    @ApiProperty()
    name: string;

    @ValidateIf((o) => o.email !== '' && o.email !== undefined)
    @IsEmail()
    @ApiProperty()
    email: string;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @ApiProperty()
    contact: number;

    @ValidateIf((o) => o.address !== '' && o.address !== undefined)
    @IsString()
    @ApiProperty()
    address: string;

    @IsOptional()
    @ApiProperty({ required: false, type: 'string', format: 'binary' })
    profile?: any;
}


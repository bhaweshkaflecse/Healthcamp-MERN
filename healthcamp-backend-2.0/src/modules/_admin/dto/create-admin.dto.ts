import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString,MinLength, Validate } from "class-validator";
import { deptType } from "src/helper/types/index.type";
import { PhoneNumberValidator } from "src/helper/utils/phone-number-validator";

export class CreateAdminDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNumber()
    // @Validate(PhoneNumberValidator)
    @ApiProperty()
    contact: number;

    @IsString()
    @ApiProperty()
    address: string;

    // @IsOptional()
    // @IsString()
    // @ApiProperty()
    // profile?: string;

    @IsEnum(deptType)
    @ApiProperty()
    department: deptType;

    @IsString()
    @ApiProperty()
    @MinLength(6)
    password: string;
}
